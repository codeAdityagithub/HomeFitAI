import { capitalizeEachWord } from "@/utils/general";
import GoBack from "../GoBack";
import { Button } from "../ui/button";
import { useSearchParams } from "@remix-run/react";
import { ExerciseGoals, ExerciseGoalText } from "@/utils/exercises/types";

type Props = {
  name: string;
  loading: boolean;
  startDetection: () => void;
  stopAnimation: ({ explicit }: { explicit: boolean }) => void;
  resetTime: () => void;
  suggestion?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  _totalTime: number;
};

const StaticDetectionUI = ({
  name,
  loading,
  startDetection,
  stopAnimation,
  resetTime,
  suggestion,
  videoRef,
  canvasRef,
  isDrawing,
  _totalTime,
}: Props) => {
  const search = useSearchParams()[0];
  const goal = search.get("goal") as ExerciseGoals;
  const duration = Number(search.get("duration"));

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-center">
        <>Total Time: {_totalTime} secs</>
      </h1>

      <div className="flex w-full items-center justify-center">
        <Button
          disabled={loading || isDrawing}
          onClick={startDetection}
        >
          {loading ? "Loading..." : "detect"}
        </Button>
        <Button
          style={{ margin: 10 }}
          variant="secondary"
          disabled={!isDrawing && _totalTime === 0}
          onClick={() => {
            stopAnimation({ explicit: isDrawing ? false : true });
          }}
        >
          {isDrawing || _totalTime === 0 ? "Stop" : "Done"}
        </Button>
        <Button
          disabled={isDrawing || _totalTime === 0}
          onClick={resetTime}
        >
          reset
        </Button>
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
export default StaticDetectionUI;
