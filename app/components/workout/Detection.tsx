import { useRef, useEffect, useState, useCallback } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
tf.ready();
// Register one of the TF.js backends.
import { drawKeypoints, drawSkeleton } from "@/utils/tensorflow/drawingutils";
import { PositionFunction } from "@/utils/tensorflow/functions";
import useStopwatch from "@/hooks/useStopwatch";
import { Button } from "../ui/button";
import GoBack from "../GoBack";
import { capitalizeEachWord } from "@/utils/general";
import DetectionUI from "./DetectionUI";
import { ExerciseGoals } from "@/utils/exercises/types";
// import { flexing, push_position, squating } from "../utils/functions";
// import "@tensorflow/tfjs-backend-wasm";

type Props = {
  name: string;
  pos_function: PositionFunction;
  start_pos: 0 | 2;
  goal:ExerciseGoals
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
// 0-> top of movement
// 1->mid
// 2->bottom of movement

function Detection({ name, pos_function, start_pos, goal }: Props) {
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
        const { _pos, _suggestion } = pos_function(
          pose.keypoints,
          sendSuggestions.current
        );

        if (_suggestion) setSuggestion(_suggestion);

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
          if (pos.current.length === 2) {
            hasStarted.current = true;
            start(0.3);
            console.log("started");
          }
          isModified.current = true;
        }

        const len = pos.current.length;

        if (len === 3 && isModified.current) {
          if (isRepeat(pos.current)) {
            // restart time on repeat and reset
            setSuggestion(suggestions.INCOMPLETE);
            if (hasStarted.current) {
              reset();
              hasStarted.current = false;
            }
            pos.current.length = 0;
          } else {
            setSuggestion("");
          }
        } else if (len === 5) {
          if (isModified.current && isComplete(start_pos, pos.current)) {
            setReps((prev) => prev + 1);
            reps_ref.current++;
            totalTime.current = parseFloat(
              (time.current + totalTime.current).toFixed(2)
            );
            // if (time.current < 2)
            //   setSuggestion("Try going slower and controlling the movement.");
            // else setSuggestion("");
            // restart();
          } else if (isModified.current) {
            setSuggestion(suggestions.INCOMPLETE);
          }
          reset();
          pos.current.length = 0;
          hasStarted.current = false;
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
      // } catch (error) {
      //   console.error("Error accessing user camera:", error);
      //   alert(error);
      // }
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

  const stopAnimation = useCallback(() => {
    console.log("canceling");
    reset();
    setSuggestion("");
    pos.current = [];
    hasStarted.current = false;
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
          totalTime.current / reps_ref.current
      );
  }, [setSuggestion]);
  const startDetection = () => {
    isdrawing.current = true;
    sendSuggestionIntervalId.current = setInterval(toggleSuggestion, 2000);
    setSuggestion("");

    animationFrameId.current = requestAnimationFrame(animate);
  };
  const resetTime = useCallback(() => {
    setReps(0);
  }, [setReps]);
  return (
    <DetectionUI
      name={name}
      reps={reps}
      loading={loading}
      startDetection={startDetection}
      stopAnimation={stopAnimation}
      resetTime={resetTime}
      suggestion={suggestion}
      videoRef={videoRef}
      canvasRef={canvasRef}
    />
  );
}
export default Detection;
