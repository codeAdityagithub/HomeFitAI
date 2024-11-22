import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/hooks/userContext";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@remix-run/react";
import { Menu, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "../dashboard/themeButton";
import { Button } from "../ui/button";

const Links = [
  { to: "", name: "Home" },
  { to: "#features", name: "Features" },
  { to: "#get-started", name: "Get Started" },
  { to: "#testimonials", name: "Testimonials" },
];
const Navbar = () => {
  const location = useLocation();
  const [hash, setHash] = useState("");
  const user = useUser();
  useEffect(() => {
    setHash(location.hash);
  }, [location.hash]);
  return (
    <>
      <nav className="hidden bg-background/70 backdrop-blur-sm lg:flex pt-10 pb-2 gap-8 lg:gap-12 z-50 sticky -top-8 xs:px-10 md:px-12 lg:px-16 xl:px-20 ">
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
        <ThemeToggle className="ml-auto w-auto">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary gap-2 hover:text-secondary-foreground"
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </ThemeToggle>
        {user ? (
          <Link to="/dashboard">
            <Button
              className="px-8"
              variant="primary"
            >
              {/* {user.image && (
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage
                    src={user.image}
                    alt="@shadcn"
                  />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              )} */}
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button
              className="px-8"
              variant="primary"
            >
              Sign Up
            </Button>
          </Link>
        )}
      </nav>
      <NavbarSm hash={hash} />
    </>
  );
};

const NavbarSm = ({ hash }: { hash: string }) => {
  const [open, setOpen] = useState(false);
  const user = useUser();
  return (
    <nav className="lg:hidden bg-background/50 backdrop-blur-sm flex pt-6 pb-4 gap-4 z-50 sticky -top-2 px-6 xs:px-10">
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
      {user ? (
        <Link
          className="ml-auto"
          to="/dashboard"
        >
          <Button className="px-8 rounded-full">Dashboard</Button>
        </Link>
      ) : (
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
      )}
      <Sheet
        open={open}
        onOpenChange={(o) => setOpen(o)}
      >
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
                    onClick={() => setOpen(false)}
                    variant="link"
                  >
                    {name}
                  </Button>
                </Link>
              </li>
            ))}
            <li className="w-full h-10">
              <ThemeToggle>
                <Button
                  variant="ghost"
                  className="hover:bg-secondary w-full gap-2 hover:text-secondary-foreground"
                >
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute -translate-x-4 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="dark:hidden">Light</span>
                  <span className="hidden dark:inline">Dark</span>
                </Button>
              </ThemeToggle>
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
export default Navbar;
