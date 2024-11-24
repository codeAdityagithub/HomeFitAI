import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import LandingPageVideo from "@/components/landing/LandingVideo";
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
    <>
      <div className="pt-4 pb-1 lg:px-16 xl:px-20 space-y-10">
        {/* hero section */}
        <Hero />
        <Features />
        <LandingPageVideo />
        <Footer />
      </div>
    </>
  );
};
export default HomePage;
