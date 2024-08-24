import { Button } from "@/components/ui/button";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [
    {
      rel: "preload",
      href: "/HeroImage.jpg",
      as: "image",
    },
  ];
};
const HomePage = () => {
  return (
    <div>
      HomePage<Button className="bg-accent">TEst</Button>
    </div>
  );
};
export default HomePage;
