import { features } from "@/routes/_landing+/index";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="h-[calc(100vh-80px)] relative flex justify-between gap-4">
      <div className="absolute inset-0 -z-10 flex items-center overflow-hidden justify-center lg:justify-start dark:justify-center">
        <picture>
          <source
            srcSet="HeroImage.png"
            media="(min-width: 1024px)"
          />
          <img
            src="HeroImageMd.png"
            loading="lazy"
            className="w-full max-w-[600px] lg:max-w-[1000px] h-full object-cover mask-left-fade"
            alt="Hero Image"
          />
        </picture>
      </div>
      <div className="flex-1 flex flex-col gap-8 justify-center mb-12 min-w-[300px] items-center lg:items-start rounded-lg ">
        <h1 className="text-5xl outline-text xs:text-6xl font-bold tracking-tighter text-accent lg:text-foreground text-center lg:text-left">
          Track Your <p className="text-primary"> Active </p>
          Lifestyle
        </h1>
        <p className="lg:test-base bg-white/60 lg:bg-transparent p-2 rounded-md backdrop-blur-sm lg:backdrop-blur-0 font-semibold lg:text-secondary-foreground tracking-wide text-center lg:text-left">
          Track Workout's.
          <span className="block">
            Get Suggestions in{" "}
            <span className="text-primary text-base">Realtime.</span>
          </span>
          Improve Faster.
        </p>
        <Button
          variant="primary"
          className="tracking-widest py-6 px-16 xs:px-20"
        >
          Get Started
        </Button>
      </div>
      <div className="hidden lg:flex flex-1 min-w-[200px] *:max-w-[250px] flex-col gap-2 items-end justify-center">
        {features.map((feat, ind) => (
          <div
            key={feat.title}
            className={cn(
              "flex flex-col w-full bg-background/80 rounded-md p-1 backdrop-blur-sm",
              ind === features.length - 1 ? "" : "border-b pb-2"
            )}
          >
            <img
              src={feat.icon}
              width={50}
              height={50}
              alt={feat.title}
            ></img>
            <h3 className="text-lg font-semibold">{feat.title}</h3>
            <p className="text-muted-foreground text-sm">
              {feat.description}
              {feat.title === "Real-time Tracking" ? (
                <span className="text-primary font-semibold block">
                  {" "}
                  using AI
                </span>
              ) : null}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Hero;