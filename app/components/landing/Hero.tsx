import { cn } from "@/lib/utils";
import { features } from "@/routes/_landing+/index";
import { Link } from "@remix-run/react";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section
      id="home"
      className="h-[calc(100vh-88px)] relative flex justify-between gap-4"
    >
      <div className="hidden absolute inset-0 -z-10 lg:flex items-center overflow-hidden justify-center">
        {/* <picture>
          <source
            srcSet="HeroDark.png"
            media="(min-width: 1024px)"
          />
          <img
            src="HeroImageMd.png"
            loading="lazy"
            className="w-full max-w-[600px] max-h-screen lg:max-h-[90vh] llg:max-h-screen h-full object-cover mask-left-fade"
            alt="Hero Image"
          />
        </picture> */}
        <img
          src="HeroDark.png"
          loading="lazy"
          className="w-full max-w-[600px] object-cover"
          alt="Hero Image"
        />
      </div>
      <div className="absolute inset-0 -z-10 flex lg:hidden items-center justify-center">
        {features.map((feat, ind) => (
          <div
            key={feat.title}
            className={cn(
              " absolute flex items-center flex-col blur-[1px]",
              ind === 0 ? "left-24 bottom-20" : "",
              ind === 1 ? "right-0 sm:right-16 top-1/3" : "",
              ind === 2 ? "left-8 top-12" : ""
            )}
          >
            <img
              src={feat.icon}
              width={100}
              height={100}
              alt={feat.title}
            ></img>
            {ind === 0
              ? "Track"
              : ind === 1
              ? "AI Powered"
              : ind === 2
              ? "Progress"
              : ""}
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-8 justify-center mb-12 min-w-[300px] items-center lg:items-start rounded-lg ">
        <h1 className="text-5xl font-mono outline-text xs:text-6xl font-bold tracking-tight text-foreground text-center lg:text-left">
          Track Your <p className="text-primary"> Active </p>
          Lifestyle
        </h1>
        <p className="test-base p-2 rounded-md font-semibold text-secondary-foreground tracking-wide text-center lg:text-left">
          Track Workout's.
          <span className="block">
            Get Suggestions in{" "}
            <span className="text-primary text-base">Realtime.</span>
          </span>
          Improve Faster.
        </p>
        <Link to="/login">
          <Button
            variant="primary"
            className="tracking-widest py-6 px-16 xs:px-20"
          >
            Get Started
          </Button>
        </Link>
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
                <>
                  {" "}
                  using
                  <span className="text-primary font-semibold block"> AI</span>
                </>
              ) : null}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Hero;
