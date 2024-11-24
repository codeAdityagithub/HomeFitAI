import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

const LandingPageVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((p) => !p);
  };

  return (
    <section>
      <h1 className="text-primary text-4xl font-bold drop-shadow-md text-center mb-4 px-4">
        See Real-Time Workout Tracking in Action
      </h1>
      <div className="relative w-full h-full p-4 flex flex-col items-center lg:max-w-[1024px] mx-auto">
        <video
          ref={videoRef}
          src="/walkthrough.mp4"
          autoPlay
          muted
          // controls
          // loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover rounded-md"
        >
          Your browser does not support the video tag.
        </video>
        <div
          className={cn(
            "absolute inset-4 flex items-center justify-center",
            isPlaying ? "" : "bg-black/10 backdrop-blur-[1px]"
          )}
        >
          <div className="group p-16 py-8 ssm:p-24 ssm:py-12 md:p-36">
            <Button
              onClick={togglePlay}
              variant="accent"
              size="icon"
              className={cn(isPlaying ? "invisible group-hover:visible" : "")}
            >
              {isPlaying ? <Pause /> : <Play />}
            </Button>
          </div>
        </div>
      </div>
      <div className="text-center mt-2 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> The workout detection happens entirely on your
          device. No video feed is ever sent to the server or saved anywhere.
          Your privacy is our priority.
        </p>
      </div>
    </section>
  );
};

export default LandingPageVideo;
