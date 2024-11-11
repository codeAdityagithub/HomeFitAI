import { Link, NavLink } from "@remix-run/react";
import { LayoutList, MessageSquareHeart, Settings } from "lucide-react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { LiaDumbbellSolid } from "react-icons/lia";

import { cn } from "@/lib/utils";
import LogoutButton from "./Logout";
import ThemeToggle from "./themeButton";

const Links = [
  {
    to: "",
    name: "Overview",
    icon: (
      <HiOutlineSquares2X2
        className="text-2xl"
        strokeWidth={1.5}
      />
    ),
  },
  {
    to: "workout",
    name: "Workout",
    icon: <LiaDumbbellSolid className="text-2xl" />,
  },
  {
    to: "playlists",
    name: "Playlists",
    icon: <LayoutList strokeWidth={1.5} />,
  },
  {
    to: "social",
    name: "Social",
    icon: <MessageSquareHeart strokeWidth={1.5} />,
  },
];
const BottomLinks = [
  {
    to: "",
    name: "Overview",
    icon: (
      <HiOutlineSquares2X2
        size={20}
        strokeWidth={1.5}
      />
    ),
  },
  {
    to: "workout",
    name: "Workout",
    icon: <LiaDumbbellSolid size={20} />,
  },
  {
    to: "social",
    name: "Social",
    icon: (
      <MessageSquareHeart
        size={20}
        strokeWidth={1.5}
        className="translate-y-0.5"
      />
    ),
  },
  {
    to: "profile",
    name: "Profile",
    icon: (
      <Settings
        size={20}
        strokeWidth={1.5}
      />
    ),
  },
];

export default function Sidebar() {
  return (
    <>
      <BottomNav />
      <div className="w-[200px] lg:w-[280px] bg-background text-foreground h-svh overflow-auto ver_scroll sticky top-0 hidden md:flex flex-col items-start justify-start pl-6 py-4">
        <Link
          to="/"
          className="font-bold flex items-center w-full p-2"
        >
          <img
            src="/logo.png"
            width={50}
            height={50}
            alt="HomeFitAI"
            className="w-6 h-6 object-cover select-none mr-4"
            onDrag={(e) => {
              e.preventDefault();
            }}
          ></img>
          HomeFit<span className="text-primary">AI</span>
        </Link>
        <p className="text-muted-foreground text-sm px-3 py-2 mt-4">
          Main Menu
        </p>
        <div className="w-full space-y-1">
          {Links.map((link) => (
            <NavLink
              key={link.to}
              end={link.to === ""}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg transition-colors hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/80"
                )
              }
            >
              <div className="w-full flex items-center py-2 px-4 gap-2">
                {link.icon}
                <span>{link.name}</span>
              </div>
            </NavLink>
          ))}
        </div>
        <p className="text-muted-foreground text-sm px-3 py-2 my-2">Others</p>
        <NavLink
          to={"profile"}
          className={({ isActive }) =>
            cn(
              "w-full rounded-lg transition-colors hover:text-accent-foreground mb-0.5",
              isActive
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/80"
            )
          }
        >
          <div className="w-full flex items-center py-2 px-3 gap-2">
            <Settings
              size={23}
              strokeWidth={1.5}
            />
            <span className="text-sm">Profile</span>
          </div>
        </NavLink>
        <ThemeToggle />
        <LogoutButton />
      </div>
    </>
  );
}

const BottomNav = () => {
  return (
    <div className="w-full fixed -bottom-[1px] bg-background text-foreground z-[90] block md:hidden p-1">
      <div className="flex *:flex-1 items-end gap-1 h-9 xs:h-10 overflow-visible">
        {BottomLinks.map((link) => (
          <NavLink
            key={link.to}
            end={link.to === ""}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "block rounded-lg transition-colors hover:text-accent-foreground h-fit",
                isActive
                  ? "bg-accent text-accent-foreground active-bottom-link"
                  : "hover:bg-accent/80"
              )
            }
          >
            <div className="w-full flex flex-col xs:flex-row justify-center items-center p-1 xs:p-2 gap-1">
              {link.icon}
              <span className="link-text">{link.name}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
