import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";
import { useCallback, useEffect, useRef, useState } from "react";
tf.ready();
// Register one of the TF.js backends.
import useStopwatch from "@/hooks/useStopwatch";
import { drawKeypoints, drawSkeleton } from "@/utils/tensorflow/drawingutils";
import { StaticPosFunction } from "@/utils/tensorflow/functions";
import ResponsiveDialog from "../custom/ResponsiveDialog";
import StaticDetectionUI from "./StaticDetectionUI";
import StaticForm from "./StaticDurationForm";
import { useSearchParams } from "@remix-run/react";
import { ExerciseGoals } from "@/utils/exercises/types";
// import { flexing, push_position, squating } from "../utils/functions";
// import "@tensorflow/tfjs-backend-wasm";

type Props = {
  name: string;
  pos_function: StaticPosFunction;
};

function StaticDetection({ name, pos_function }: Props) {
  const animationFrameId = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector>();
  const streamRef = useRef<MediaStream>();
  const lastFrameTime = useRef(performance.now());
  const targetFrameRate = 25; // Set your desired frame rate here
  const isdrawing = useRef(false);
  const sendSuggestions = useRef(true);
  const sendSuggestionIntervalId = useRef<NodeJS.Timeout>();

  const [loading, setLoading] = useState(false);

  const [suggestion, setSuggestion] = useState("");

  const { start, reset, _time, stop, time } = useStopwatch();

  const [voice, setVoice] = useState<SpeechSynthesisVoice>();

  const search = useSearchParams()[0];
  const type = search.get("goal") as Exclude<ExerciseGoals, "Reps" | "TUT">;
  const duration = Number(search.get("duration"));

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
        const { _suggestion } = pos_function(
          pose.keypoints,
          sendSuggestions.current
        );
        if (sendSuggestions.current) sendSuggestions.current = false;
        if (_suggestion) setSuggestion(_suggestion);
      }
      if (type === "Timed" && time.current >= duration)
        stopAnimation({ explicit: true });
      // Update last frame time for the next iteration
      lastFrameTime.current = currentTime;
      // Request the next frame
      animationFrameId.current = requestAnimationFrame(animate);
    },
    [setSuggestion]
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
    setSuggestion("");
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

      setSuggestion("");
      stop();
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

      if (explicit && trigger_ref.current) {
        trigger_ref.current.click();
      }
    },
    [setSuggestion]
  );

  const startDetection = () => {
    isdrawing.current = true;
    setIsDrawing(true);
    sendSuggestionIntervalId.current = setInterval(toggleSuggestion, 2000);
    setSuggestion("");
    start();
    animationFrameId.current = requestAnimationFrame(animate);
  };

  return (
    <>
      <StaticDetectionUI
        name={name}
        loading={loading}
        startDetection={startDetection}
        stopAnimation={stopAnimation}
        resetTime={reset}
        suggestion={suggestion}
        videoRef={videoRef}
        canvasRef={canvasRef}
        isDrawing={_isDrawing}
        _totalTime={_time}
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
        <StaticForm totalTime={_time} />
      </ResponsiveDialog>
    </>
  );
}
export default StaticDetection;
