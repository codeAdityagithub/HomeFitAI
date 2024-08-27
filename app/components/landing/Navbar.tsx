import { Link, NavLink, useLocation } from "@remix-run/react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const Links = [
  { to: "", name: "Home" },
  { to: "#features", name: "Features" },
  { to: "#get-started", name: "Get Started" },
  { to: "#testimonials", name: "Testimonials" },
];
const Navbar = () => {
  const location = useLocation();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(location.hash);
  }, [location.hash]);
  return (
    <>
      <nav className="hidden md:flex pt-10 gap-8 lg:gap-12 z-50 sticky bg-transparent xs:px-10 md:px-12 lg:px-16 xl:px-20 ">
        <span className="min-w-8 min-h-8 w-8 h-8 aspect-square">
          <img
            src="/logo.png"
            width={50}
            height={50}
            alt="HomeFitAI"
            className="w-full h-full object-cover select-none"
            onDrag={(e) => {
              e.preventDefault();
            }}
          ></img>
        </span>
        <ul className="flex gap-8 lg:gap-12 items-start">
          {Links.map(({ to, name }) => (
            <li
              key={to}
              className=""
            >
              <Link to={to}>
                <Button
                  className={cn(
                    "hover:text-primary transition-colors",
                    hash === to ? "text-primary" : "text-foreground"
                  )}
                  variant="link"
                >
                  {name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          className="ml-auto"
          to="/login"
        >
          <Button
            className="px-8"
            variant="primary"
          >
            Sign Up
          </Button>
        </Link>
      </nav>
      <NavbarSm hash={hash} />
    </>
  );
};

const NavbarSm = ({ hash }: { hash: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="md:hidden flex pt-10 gap-8 lg:gap-12 z-50 sticky bg-transparent px-6 xs:px-10">
      <span className="min-w-8 min-h-8 w-8 h-8 aspect-square">
        <img
          src="/logo.png"
          width={50}
          height={50}
          alt="HomeFitAI"
          className="w-full h-full object-cover select-none"
          onDrag={(e) => {
            e.preventDefault();
          }}
        ></img>
      </span>
      <Link
        className="ml-auto"
        to="/login"
      >
        <Button
          className="px-8"
          variant="primary"
        >
          Sign Up
        </Button>
      </Link>
      <Sheet onOpenChange={(o) => setOpen(o)}>
        <SheetTrigger>
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-3xl font-extrabold text-center tracking-widest">
              HomeFit<span className="text-primary">AI</span>
            </SheetTitle>
          </SheetHeader>

          <ul className="flex flex-col gap-8 mt-10 items-center">
            {Links.map(({ to, name }) => (
              <li
                key={to}
                className="w-full h-10"
              >
                <Link to={to}>
                  <Button
                    className={cn(
                      "hover:text-primary transition-colors text-lg w-full font-semibold tracking-widest",
                      hash === to ? "text-primary" : "text-foreground"
                    )}
                    variant="link"
                  >
                    {name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
export default Navbar;
