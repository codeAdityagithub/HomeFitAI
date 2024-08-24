import { Link } from "@remix-run/react";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="p-12 flex gap-12">
      <span className="w-8 h-8 aspect-square">
        <img
          src="/logo.png"
          width={50}
          height={50}
          alt="HomeFitAI"
          className="w-full h-full object-cover"
        ></img>
      </span>
      <ul className="flex gap-12 items-start">
        <li className="">
          <Link to="/">
            <Button
              className="text-foreground hover:text-primary transition-colors"
              variant="link"
            >
              Home
            </Button>
          </Link>
        </li>
        <li>
          <Link to="#features">
            <Button
              className="text-foreground hover:text-primary transition-colors"
              variant="link"
            >
              Features
            </Button>
          </Link>
        </li>
        <li>
          <Link to="#get-started">
            <Button
              className="text-foreground hover:text-primary transition-colors"
              variant="link"
            >
              Get Started
            </Button>
          </Link>
        </li>
        <li>
          <Link to="#testimonials">
            <Button
              className="text-foreground hover:text-primary transition-colors"
              variant="link"
            >
              Testimonials
            </Button>
          </Link>
        </li>
      </ul>
      <Button
        className="px-8 ml-auto"
        variant="primary"
      >
        Sign Up
      </Button>
    </nav>
  );
};
export default Navbar;
