import { useRef, useEffect, useState, useCallback } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
tf.ready();
// Register one of the TF.js backends.
import { drawKeypoints, drawSkeleton } from "@/utils/tensorflow/drawingutils";
import { PositionFunction } from "@/utils/tensorflow/functions";
import { curlsSuggestions } from "@/lib/exerciseSuggestions";
import useStopwatch from "@/hooks/useStopwatch";
import { Button } from "../ui/button";
import GoBack from "../GoBack";
// import { flexing, push_position, squating } from "../utils/functions";
// import "@tensorflow/tfjs-backend-wasm";

type Exercise = {
  name: string;
  pos_function: PositionFunction;
  start_pos: 0 | 2;
};

const valid_seq = { 0: "0,1,2,1,0", 2: "2,1,0,1,2" };
function isComplete(start_pos: 0 | 2, pos: number[]) {
  return valid_seq[start_pos] === pos.toString();
}

function isRepeat(pos: number[]) {
  return pos[0] === pos[2];
}
// 0-> up
// 1->mid
// 2->down

function Detection({ name, pos_function, start_pos }: Exercise) {
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
  const isModified = useRef(false);

  const pos = useRef<number[]>([]);
  const [reps, setReps] = useState(0);
  const reps_ref = useRef(0);
  const [loading, setLoading] = useState(false);

  const [suggestion, setSuggestion] = useState("");
  const { start, reset, restart, time } = useStopwatch();

  const hasStarted = useRef(false);
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
        const { _pos } = pos_function(pose.keypoints, sendSuggestions.current);
        // if (_suggestion) setSuggestion(_suggestion);
        const top = pos.current[pos.current.length - 1];

        // is pos is empty only push start position
        if (top === undefined) {
          if (_pos === start_pos) {
            isModified.current = true;
            pos.current.push(_pos);
            // console.log(pos.current);
          }
        }
        // push only if different position
        else if (top !== _pos) {
          pos.current.push(_pos);
          // console.log(pos.current);

          isModified.current = true;
        }
        const len = pos.current.length;
        if (len === 3 && isModified.current) {
          if (isRepeat(pos.current)) {
            setSuggestion(curlsSuggestions.INCOMPLETE);
            // restart time on repeat and reset
            if (hasStarted.current) restart();
            pos.current = [start_pos];
          } else {
            // start the timer if its not a repeat
            if (!hasStarted.current) {
              start(1);
              hasStarted.current = true;
            }
            setSuggestion("");
          }
        } else if (len === 5) {
          if (isModified.current && isComplete(start_pos, pos.current)) {
            setReps((prev) => prev + 1);
            reps_ref.current++;
            setSuggestion("");
            pos.current = [start_pos];
            totalTime.current = parseFloat(
              (time.current + totalTime.current).toFixed(2)
            );
            console.log(time.current);
            restart();
          } else if (isModified.current) {
            setSuggestion(curlsSuggestions.INCOMPLETE);
            pos.current = [];
            reset();
            hasStarted.current = false;
          }
        }
        isModified.current = false;
      }
      // Update last frame time for the next iteration
      lastFrameTime.current = currentTime;
      // Request the next frame
      animationFrameId.current = requestAnimationFrame(animate);
    },
    [setReps, setSuggestion, start_pos]
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
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
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
    reset();
    setSuggestion("");
    pos.current = [];
    hasStarted.current = false;
    clearInterval(sendSuggestionIntervalId.current);
    isdrawing.current = false;
    cancelAnimationFrame(animationFrameId.current!);

    if (streamRef.current) {
      console.log("camera stopping");
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      }); // Stops the camera
    }

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
          totalTime.current / reps_ref.current
      );
  }, [setSuggestion]);

  return (
    <div>
      <div className="flex gap-2 items-center">
        <GoBack />
        <h1>
          {name} Reps : {reps}
        </h1>
      </div>
      {/* <h1>Time : {time} seconds</h1> */}
      <Button
        disabled={loading}
        onClick={async () => {
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
      <Button onClick={() => setReps(0)}>reset</Button>
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
export default Detection;
