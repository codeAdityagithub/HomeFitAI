import { useRef, useEffect, useState, useCallback } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
tf.ready();
// Register one of the TF.js backends.
import { drawKeypoints, drawSkeleton } from "@/utils/tensorflow/drawingutils";
import type { PositionFunctionUnilateral } from "@/utils/tensorflow/functions";
import { curlsSuggestions } from "@/lib/exerciseSuggestions";
import useStopwatch from "@/hooks/useStopwatch";
import { Button } from "../ui/button";
import GoBack from "../GoBack";
// import { flexing, push_position, squating } from "../utils/functions";
// import "@tensorflow/tfjs-backend-wasm";

type Exercise = {
  name: string;
  pos_function: PositionFunctionUnilateral;
  start_pos: 0 | 2;
};

const valid_seq = {
  0: [0, 1, 2, 1, 0],
  2: [2, 1, 0, 1, 2],
};

function isComplete(start_pos: 0 | 2, pos: number[]): boolean {
  const validArray = valid_seq[start_pos];

  return (
    pos[0] === validArray[0] &&
    pos[1] === validArray[1] &&
    pos[2] === validArray[2] &&
    pos[3] === validArray[3] &&
    pos[4] === validArray[4]
  );
}

function isRepeat(pos: number[]) {
  return pos[0] === pos[2];
}
// 0-> up
// 1->mid
// 2->down

export default function DetectionUnilateral({
  name,
  pos_function,
  start_pos,
}: Exercise) {
  const animationFrameId = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector>();
  const streamRef = useRef<MediaStream>();
  const lastFrameTime = useRef(performance.now());
  const targetFrameRate = 30; // Set your desired frame rate here
  const isdrawing = useRef(false);
  const sendSuggestions = useRef(true);
  const sendSuggestionIntervalId = useRef<NodeJS.Timeout>();
  const isModified_left = useRef(false);
  const isModified_right = useRef(false);

  const pos_left = useRef<number[]>([]);
  const pos_right = useRef<number[]>([]);
  const [reps_left, setRepsLeft] = useState(0);
  const [reps_right, setRepsRight] = useState(0);
  const reps_left_ref = useRef(0);
  const reps_right_ref = useRef(0);
  const [loading, setLoading] = useState(false);

  const [suggestion, setSuggestion] = useState("");
  const {
    start: start_left,
    reset: reset_left,
    restart: restart_left,
    time: time_left,
  } = useStopwatch();
  const {
    start: start_right,
    reset: reset_right,
    restart: restart_right,
    time: time_right,
  } = useStopwatch();

  const hasStarted_left = useRef(false);
  const hasStarted_right = useRef(false);
  const totalTime = useRef(0);

  const animate = useCallback(
    async (currentTime: number) => {
      if (isdrawing.current == false) return;
      const elapsedTime = currentTime - lastFrameTime.current;

      // Calculate the expected frame duration based on the target frame rate
      const expectedFrameDuration = 1000 / targetFrameRate;

      // If the elapsed time is less than the expected frame duration, skip rendering
      if (elapsedTime < expectedFrameDuration || !videoRef.current) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      // Your animation logic goes here
      const poses = await detectorRef.current!.estimatePoses(videoRef.current);
      const pose = poses[0];
      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      // Ensure canvas dimensions match video dimensions
      video.width = video.videoWidth;
      video.height = video.videoHeight;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!pose) {
        animationFrameId.current = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      // console.log(pose.keypoints);
      drawKeypoints(pose.keypoints, 0.5, ctx);
      drawSkeleton(pose.keypoints, 0.5, ctx);
      // setIsFlexing(flexing(pose.keypoints));
      if (pose.score && pose.score > 0.4) {
        const { _posleft, _posright } = pos_function(
          pose.keypoints,
          sendSuggestions.current
        );
        // if (_suggestion) setSuggestion(_suggestion);
        const top_left = pos_left.current[pos_left.current.length - 1];
        const top_right = pos_right.current[pos_right.current.length - 1];

        // is pos is empty only push start position
        if (top_left === undefined) {
          if (_posleft === start_pos) {
            isModified_left.current = true;
            pos_left.current.push(_posleft);
            // console.log(pos.current);
          }
        }
        // push only if different position
        else if (top_left !== _posleft) {
          pos_left.current.push(_posleft);

          if (pos_left.current.length === 2) {
            hasStarted_left.current = true;
            start_left(0.3);
            console.log("started left");
          }

          isModified_left.current = true;
        }

        if (top_right === undefined) {
          if (_posright === start_pos) {
            isModified_right.current = true;
            pos_right.current.push(_posright);
            // console.log(pos.current);
          }
        }
        // push only if different position
        else if (top_right !== _posright) {
          pos_right.current.push(_posright);

          if (pos_right.current.length === 2) {
            hasStarted_right.current = true;
            start_right(0.3);
            console.log("started right");
          }

          isModified_right.current = true;
        }

        const len_left = pos_left.current.length;
        const len_right = pos_right.current.length;

        if (len_left === 3 && isModified_left.current) {
          if (isRepeat(pos_left.current)) {
            setSuggestion(curlsSuggestions.INCOMPLETE);
            // restart time on repeat and reset
            if (hasStarted_left.current) {
              reset_left();
              hasStarted_left.current = false;
            }
            pos_left.current.length = 0;
          } else {
            setSuggestion("");
          }
        } else if (len_left === 5) {
          if (
            isModified_left.current &&
            isComplete(start_pos, pos_left.current)
          ) {
            setRepsLeft((prev) => prev + 1);
            reps_left_ref.current++;
            setSuggestion("");

            if (!hasStarted_right.current) {
              totalTime.current = parseFloat(
                (time_left.current + totalTime.current).toFixed(2)
              );
            }
          } else if (isModified_left.current) {
            setSuggestion(curlsSuggestions.INCOMPLETE);
          }
          reset_left();
          pos_left.current.length = 0;
          hasStarted_left.current = false;
        }
        if (len_right === 3 && isModified_right.current) {
          if (isRepeat(pos_right.current)) {
            setSuggestion(curlsSuggestions.INCOMPLETE);
            // restart time on repeat and reset
            if (hasStarted_right.current) {
              reset_right();
              hasStarted_right.current = false;
            }
            pos_right.current.length = 0;
          } else {
            setSuggestion("");
          }
        } else if (len_right === 5) {
          if (
            isModified_right.current &&
            isComplete(start_pos, pos_right.current)
          ) {
            setRepsRight((prev) => prev + 1);
            reps_right_ref.current++;
            setSuggestion("");
            if (!hasStarted_left.current) {
              totalTime.current = parseFloat(
                (time_right.current + totalTime.current).toFixed(2)
              );
            }
          } else if (isModified_right.current) {
            setSuggestion(curlsSuggestions.INCOMPLETE);
          }
          reset_right();
          pos_right.current.length = 0;
          hasStarted_right.current = false;
        }

        isModified_left.current = false;
        isModified_right.current = false;
      }
      // Update last frame time for the next iteration
      lastFrameTime.current = currentTime;
      // Request the next frame
      animationFrameId.current = requestAnimationFrame(animate);
    },
    [setRepsLeft, setRepsRight, setSuggestion, start_pos]
  );

  const handleResize = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.width = videoRef.current.videoWidth;
      videoRef.current.height = videoRef.current.videoHeight;
    }
  }, []);
  const toggleSuggestion = useCallback(() => {
    // console.log("toggle");
    sendSuggestions.current = !sendSuggestions.current;
  }, []);

  useEffect(() => {
    // Start the animation loop
    window.addEventListener("resize", handleResize);

    const startCamera = async () => {
      setLoading(true);
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          // animationFrameId.current = requestAnimationFrame(animate);
        }
        if (videoRef.current) {
          videoRef.current.width = videoRef.current.videoWidth;
          videoRef.current.height = videoRef.current.videoHeight;
        }

        detectorRef.current = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          }
        );

        setLoading(false);
      } catch (error) {
        console.error("Error accessing user camera:", error);
        alert(error);
      }
    };

    startCamera();
    // Cleanup function
    return () => {
      // Stop animation loop when component unmounts
      stopAnimation();

      if (streamRef.current) {
        console.log("camera stopping");
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        }); // Stops the camera
      }

      window.removeEventListener("resize", handleResize);
      clearInterval(sendSuggestionIntervalId.current);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  //  useEffect for time related stuff
  // useEffect(() => {
  //   if (lastRepTime.current > time && wasRepComplete.current) {
  //     totalTime.current += lastRepTime.current;
  //     // console.log(lastRepTime);
  //   }
  //   lastRepTime.current = time;
  // }, [time]);

  const stopAnimation = useCallback(() => {
    console.log("canceling");
    reset_left();
    reset_right();
    setSuggestion("");
    pos_left.current = [];
    pos_right.current = [];
    hasStarted_left.current = false;
    hasStarted_right.current = false;
    clearInterval(sendSuggestionIntervalId.current);
    isdrawing.current = false;
    cancelAnimationFrame(animationFrameId.current!);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext("2d")!;
      // Ensure canvas dimensions match video dimensions

      canvas.width = video.width;
      canvas.height = video.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (totalTime.current)
      console.info(
        "Total time was : " +
          totalTime.current +
          " Average time was : " +
          totalTime.current / (reps_left_ref.current + reps_right_ref.current)
      );
  }, [setSuggestion]);

  return (
    <div>
      <div className="flex gap-2 items-center">
        <GoBack />
        <h1>{name}</h1>
        <h1 className="text-2xl font-bold">
          left : {reps_left}
          right : {reps_right}
        </h1>
      </div>
      {/* <h1>Time : {time} seconds</h1> */}
      <Button
        disabled={loading}
        onClick={() => {
          isdrawing.current = true;
          sendSuggestionIntervalId.current = setInterval(
            toggleSuggestion,
            1000
          );
          setSuggestion("");

          animationFrameId.current = requestAnimationFrame(animate);
        }}
      >
        {loading ? "Loading..." : "detect"}
      </Button>
      <Button
        style={{ margin: 10 }}
        onClick={() => {
          stopAnimation();
          // setIsdra wing(false);
        }}
      >
        stop
      </Button>
      <Button
        onClick={() => {
          setRepsLeft(0);
          setRepsRight(0);
        }}
      >
        reset
      </Button>
      <br />
      {suggestion ?? null}
      <div
        style={{
          position: "relative",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.width = videoRef.current.videoWidth;
              videoRef.current.height = videoRef.current.videoHeight;
            }
          }}
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "640px",
            maxHeight: "480px",
            transform: "scaleX(-1)", // Flip video horizontally
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            // backgroundColor: "red",
            top: 0,
            // left: 0,
            width: "100%",
            height: "100%",
            alignSelf: "center",
            maxWidth: "640px",
            maxHeight: "480px",
            transform: "scaleX(-1)", // Flip canvas horizontally to match video
          }}
        />
      </div>
    </div>
  );
}
