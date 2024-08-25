import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      href: "/HeroImage.png",
      as: "image",
    },
    {
      rel: "preload",
      href: "/HeroImageMd.png",
      as: "image",
    },
    {
      rel: "preload",
      href: "/HeroImageDark.png",
      as: "image",
    },
  ];
};

const features = [
  {
    title: "Real-time Tracking",
    description: "Track your workouts in real-time",
    icon: "/tracking.svg",
  },
  {
    title: "Real-time Suggestions",
    description: "Get Suggestions on your exercise form.",
    icon: "/suggestions.svg",
  },
  {
    title: "Personalized Progress",
    description: "Get Personalized Progress Reports and Logs.",
    icon: "/logging.svg",
  },
];
const HomePage = () => {
  return (
    <div className="h-[calc(100vh-80px)] py-4 lg:px-16 xl:px-20 ">
      {/* hero section */}
      <section className="relative flex justify-between gap-4 h-full">
        <div className="absolute inset-0 -z-10 flex items-center justify-center lg:justify-start dark:justify-center">
          <img
            src="HeroImage.png"
            loading="lazy"
            className="w-full max-w-[1000px] dark:hidden h-full object-cover hidden lg:block dark:-scale-x-100"
          />
          <img
            src="HeroImageMd.png"
            loading="lazy"
            className="w-full max-w-[800px] dark:hidden h-full object-cover lg:hidden dark:-scale-x-100"
          />
          <img
            src="HeroImageDark.png"
            loading="lazy"
            className="w-full max-w-[1000px] hidden dark:block h-full object-cover -scale-x-100"
          />
        </div>
        <div className="flex-1 flex flex-col gap-8 justify-center mb-12 min-w-[300px] items-center lg:items-start rounded-lg ">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter text-accent lg:text-foreground text-center lg:text-left">
            Track Your <p className="text-primary"> Active </p>Lifestyle
          </h1>
          <p className="text-sm lg:test-base font-semibold text-secondary lg:text-muted-foreground tracking-wide text-center lg:text-left">
            Track Workout's.
            <span className="block">
              Get Suggestions in{" "}
              <span className="text-primary text-base">Realtime.</span>
            </span>
            Improve Faster.
          </p>
          <Button
            variant="primary"
            className="tracking-wider hover:tracking-widest py-6 px-20"
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
    </div>
  );
};
export default HomePage;
