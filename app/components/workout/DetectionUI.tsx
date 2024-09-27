import { capitalizeEachWord } from "@/utils/general";
import GoBack from "../GoBack";
import { Button } from "../ui/button";

type Props =
  | {
      reps: number;
      name: string;
      loading: boolean;
      startDetection: () => void;
      stopAnimation: () => void;
      resetTime: () => void;
      suggestion?: string;
      videoRef: React.RefObject<HTMLVideoElement>;
      canvasRef: React.RefObject<HTMLCanvasElement>;
    }
  | {
      reps: { left: number; right: number };
      name: string;
      loading: boolean;
      startDetection: () => void;
      stopAnimation: () => void;
      resetTime: () => void;
      suggestion?: string;
      videoRef: React.RefObject<HTMLVideoElement>;
      canvasRef: React.RefObject<HTMLCanvasElement>;
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
}: Props) => {
  return (
    <div className="w-full">
      <div className="flex gap-2 items-center">
        <GoBack />
        <h1 className="text-2xl font-bold">{capitalizeEachWord(name)}</h1>
      </div>
      <h1 className="text-2xl font-bold text-center">
        Reps :{" "}
        {typeof reps === "number" ? (
          reps
        ) : (
          <>
            {reps.left} {reps.right}
          </>
        )}
      </h1>
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
            stopAnimation();
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
