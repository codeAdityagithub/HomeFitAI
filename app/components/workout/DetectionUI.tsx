import { capitalizeEachWord } from "@/utils/general";
import GoBack from "../GoBack";
import { Button } from "../ui/button";
import { useSearchParams } from "@remix-run/react";
import { ExerciseGoals, ExerciseGoalText } from "@/utils/exercises/types";

type Props =
  | {
      reps: number;
      name: string;
      loading: boolean;
      startDetection: () => void;
      stopAnimation: ({ explicit }: { explicit: boolean }) => void;
      resetTime: () => void;
      suggestion?: string;
      videoRef: React.RefObject<HTMLVideoElement>;
      canvasRef: React.RefObject<HTMLCanvasElement>;
      _time: number;
    }
  | {
      reps: { left: number; right: number };
      name: string;
      loading: boolean;
      startDetection: () => void;
      stopAnimation: ({ explicit }: { explicit: boolean }) => void;

      resetTime: () => void;
      suggestion?: string;
      videoRef: React.RefObject<HTMLVideoElement>;
      canvasRef: React.RefObject<HTMLCanvasElement>;
      _time: { left: number; right: number };
    };
const DetectionUI = ({
  name,
  reps,
  loading,
  startDetection,
  stopAnimation,
  resetTime,
  suggestion,
  videoRef,
  canvasRef,
  _time,
}: Props) => {
  const search = useSearchParams()[0];
  const goal = search.get("goal") as ExerciseGoals;
  const duration = Number(search.get("duration"));

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center mb-4">
        <GoBack />
        <h1 className="text-2xl font-bold text-muted-foreground underline underline-offset-4">
          {capitalizeEachWord(name)}
        </h1>
      </div>
      <h1 className="text-2xl font-bold text-center">
        Reps :{" "}
        {typeof reps === "number" ? (
          reps
        ) : (
          <>
            left:{reps.left} right:{reps.right}
          </>
        )}
        <br />
        {goal === "TUT" && (
          <>
            Rep Time:{" "}
            {typeof _time === "number" ? (
              _time
            ) : (
              <>
                left : {_time.left}s right : {_time.right}s
              </>
            )}
          </>
        )}
      </h1>
      {goal !== "Free" && (
        <h1 className="text-lg font-semibold text-center text-muted-foreground">
          {ExerciseGoalText[goal]} : {duration}{" "}
          {goal === "Reps" ? "Reps" : "Seconds"}
        </h1>
      )}
      <div className="flex w-full items-center justify-center">
        <Button
          disabled={loading}
          onClick={startDetection}
        >
          {loading ? "Loading..." : "detect"}
        </Button>
        <Button
          style={{ margin: 10 }}
          variant="secondary"
          onClick={() => {
            stopAnimation({ explicit: true });
          }}
        >
          stop
        </Button>
        <Button onClick={resetTime}>reset</Button>
      </div>
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
            borderRadius: "0.5rem",
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
};
export default DetectionUI;
