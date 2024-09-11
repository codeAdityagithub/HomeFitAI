import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      href: "/HeroDark.png",
      as: "image",
    },
  ];
};

export const features = [
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
    <div className="py-4 lg:px-16 xl:px-20">
      {/* hero section */}
      <Hero />
      <Features />
    </div>
  );
};
export default HomePage;
