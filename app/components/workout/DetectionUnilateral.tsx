import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";
import { useCallback, useEffect, useRef, useState } from "react";
tf.ready();
// Register one of the TF.js backends.
import useStopwatch from "@/hooks/useStopwatch";
import { ExerciseGoals } from "@/utils/exercises/types";
import { drawKeypoints, drawSkeleton } from "@/utils/tensorflow/drawingutils";
import type { PositionFunctionUnilateral } from "@/utils/tensorflow/functions";
import { useSearchParams } from "@remix-run/react";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import DetectionForm from "./DetectionForm";
import DetectionUI from "./DetectionUI";
// import { flexing, push_position, squating } from "../utils/functions";
// import "@tensorflow/tfjs-backend-wasm";

type Props = {
  name: string;

  pos_function: PositionFunctionUnilateral;
  start_pos: 0 | 2;
};

const valid_seq = {
  0: [0, 1, 2, 1, 0],
  2: [2, 1, 0, 1, 2],
};
const suggestions = {
  INCOMPLETE: "Please try to perform full range of motion.",
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
}: Props) {
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

  const suggestionSet = useRef(false);
  const updateSuggestion = (s: string) => {
    if (suggestionSet.current) return;

    setSuggestion(s);
    suggestionSet.current = true;
    setTimeout(() => {
      setSuggestion("");
      suggestionSet.current = false;
    }, 2000);
  };

  const {
    start: start_left,
    reset: reset_left,
    restart: restart_left,
    time: time_left,
    _time: _timeleft,
  } = useStopwatch();
  const {
    start: start_right,
    reset: reset_right,
    restart: restart_right,
    time: time_right,
    _time: _timeright,
  } = useStopwatch();

  const search = useSearchParams()[0];
  const type = search.get("goal") as ExerciseGoals;
  const duration = Number(search.get("duration"));

  const hasStarted_left = useRef(false);
  const hasStarted_right = useRef(false);
  const totalTime = useRef(0);

  const [voice, setVoice] = useState<SpeechSynthesisVoice>();

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
        const { _posleft, _posright, _suggestion } = pos_function(
          pose.keypoints,
          sendSuggestions.current
        );
        if (sendSuggestions.current) sendSuggestions.current = false;

        if (_suggestion) setSuggestion(_suggestion);

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
            // console.log("started left");
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
            // console.log("started right");
          }

          isModified_right.current = true;
        }

        const len_left = pos_left.current.length;
        const len_right = pos_right.current.length;

        if (len_left === 3 && isModified_left.current) {
          if (isRepeat(pos_left.current)) {
            setSuggestion(suggestions.INCOMPLETE);
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
            if (reps_right_ref.current >= 50) stopAnimation({ explicit: true });
            else {
              setRepsLeft((prev) => prev + 1);
              reps_left_ref.current++;

              if (!hasStarted_right.current) {
                totalTime.current = parseFloat(
                  (time_left.current + totalTime.current).toFixed(2)
                );
              }
              if (type === "TUT" && time_left.current < duration)
                setSuggestion("Try going slower and controlling the movement.");
              else setSuggestion("");

              if (
                type === "Reps" &&
                reps_left_ref.current >= duration &&
                reps_right_ref.current >= duration
              )
                stopAnimation({ explicit: true });
              else if (type === "Timed" && totalTime.current >= duration)
                stopAnimation({ explicit: true });
            }
          } else if (isModified_left.current) {
            setSuggestion(suggestions.INCOMPLETE);
          }
          reset_left();
          pos_left.current.length = 0;
          hasStarted_left.current = false;
        }
        if (len_right === 3 && isModified_right.current) {
          if (isRepeat(pos_right.current)) {
            setSuggestion(suggestions.INCOMPLETE);
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
            if (reps_left_ref.current >= 50) stopAnimation({ explicit: true });
            else {
              setRepsRight((prev) => prev + 1);
              reps_right_ref.current++;

              if (!hasStarted_left.current) {
                totalTime.current = parseFloat(
                  (time_right.current + totalTime.current).toFixed(2)
                );
              }
              if (type === "TUT" && time_right.current < duration)
                setSuggestion("Try going slower and controlling the movement.");
              else setSuggestion("");

              if (
                type === "Reps" &&
                reps_left_ref.current >= duration &&
                reps_right_ref.current >= duration
              )
                stopAnimation({ explicit: true });
              else if (type === "Timed" && totalTime.current >= duration)
                stopAnimation({ explicit: true });
            }
          } else if (isModified_right.current) {
            setSuggestion(suggestions.INCOMPLETE);
          }
          reset_right();
          pos_right.current.length = 0;
          hasStarted_right.current = false;
        }

        isModified_left.current = false;
        isModified_right.current = false;
      }
      if (type === "Timed" && duration - Math.round(totalTime.current) == 5) {
        updateSuggestion("5 more seconds to go!");
      }
      // Update last frame time for the next iteration
      lastFrameTime.current = currentTime;
      // Request the next frame
      animationFrameId.current = requestAnimationFrame(animate);
    },
    [setRepsLeft, setRepsRight, setSuggestion, start_pos, type, duration]
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
    if ("speechSynthesis" in window && suggestion !== "") {
      if (!window.speechSynthesis.speaking) {
        const utterance = new SpeechSynthesisUtterance(suggestion);

        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
      }
    }
  }, [suggestion, voice]);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      setVoice(
        window.speechSynthesis
          .getVoices()
          .find((v) => v.name === "Google UK English Male")
      ); // Set default to a Neural voice
    };

    // Initial load
    loadVoices();
    // Load voices when they change
    if ("speechSynthesis" in window)
      window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ("speechSynthesis" in window)
        window.speechSynthesis.onvoiceschanged = null; // Cleanup
    };
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
      } catch (error: any) {
        if (error.name === "NotAllowedError") {
          // You can display a message to the user here

          alert("Please allow access to your camera.");
        } else if (error.name === "NotFoundError") {
          alert("Cannot find a camera on your device.");
        } else {
          console.log(
            "An error occurred: ",
            error.message ?? "Cannot load detector at this moment."
          );
        }
      }
    };

    startCamera();
    // Cleanup function
    return () => {
      // Stop animation loop when component unmounts
      stopAnimation({ explicit: false });

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

  const trigger_ref = useRef<HTMLButtonElement>(null);
  const [_totalTime, _setTotalTime] = useState(0);
  const [_isDrawing, setIsDrawing] = useState(false);

  const stopAnimation = useCallback(
    ({ explicit }: { explicit: boolean }) => {
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
      setIsDrawing(false);
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
            totalTime.current /
              Math.max(reps_left_ref.current, reps_right_ref.current)
        );
      if (totalTime.current && explicit && trigger_ref.current) {
        _setTotalTime(totalTime.current);
        trigger_ref.current.click();
      }
    },
    [setSuggestion]
  );

  const startDetection = useCallback(() => {
    isdrawing.current = true;
    setIsDrawing(true);
    sendSuggestionIntervalId.current = setInterval(toggleSuggestion, 2000);
    setSuggestion("");

    animationFrameId.current = requestAnimationFrame(animate);
  }, [setIsDrawing, setSuggestion]);

  const resetTime = useCallback(() => {
    setRepsLeft(0);
    setRepsRight(0);
  }, [setRepsLeft, setRepsRight]);

  return (
    <>
      <DetectionUI
        name={name}
        reps={{ left: reps_left, right: reps_right }}
        loading={loading}
        startDetection={startDetection}
        stopAnimation={stopAnimation}
        resetTime={resetTime}
        suggestion={suggestion}
        videoRef={videoRef}
        canvasRef={canvasRef}
        _time={{ left: _timeleft, right: _timeright }}
        isDrawing={_isDrawing}
        _totalTime={totalTime.current}
      />
      <ResponsiveDialog
        description="You can save the exercise data to your daily log from here..."
        title="Add Exercise to Log"
        trigger={
          <button
            className="hidden"
            ref={trigger_ref}
          ></button>
        }
      >
        <DetectionForm
          totalTime={_totalTime}
          reps={{ left: reps_left, right: reps_right }}
        />
      </ResponsiveDialog>
    </>
  );
}
