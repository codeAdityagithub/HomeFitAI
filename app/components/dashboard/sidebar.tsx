import { Form, Link, NavLink } from "@remix-run/react";
import {
  Dumbbell,
  LayoutList,
  LogOut,
  MessageSquareHeart,
  NotepadText,
  Settings,
} from "lucide-react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { LiaDumbbellSolid } from "react-icons/lia";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import GNavLink from "@/utils/GNavlink";
import { IoPersonOutline } from "react-icons/io5";

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
  { to: "stats", name: "Stats", icon: <NotepadText strokeWidth={1.5} /> },
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
  { to: "stats", name: "Stats", icon: <NotepadText strokeWidth={1.5} /> },
  {
    to: "settings",
    name: "Settings",
    icon: (
      <IoPersonOutline
        className="text-2xl"
        strokeWidth={1.5}
      />
    ),
  },
];

export default function Sidebar() {
  return (
    <>
      <BottomNav />
      <div className="w-[280px] hidden md:flex flex-col items-start justify-start px-6 py-4">
        <div className="font-bold flex items-center w-full p-2">
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
        </div>
        <p className="text-muted-foreground text-sm px-3 py-2 mt-4">
          Main Menu
        </p>
        <div className="w-full space-y-1">
          {Links.map((link) => (
            <GNavLink
              key={link.to}
              end
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : ""
                )
              }
            >
              <div className="w-full flex items-center p-2 gap-2">
                {link.icon}
                <span>{link.name}</span>
              </div>
            </GNavLink>
          ))}
        </div>
        <p className="text-muted-foreground text-sm px-3 py-2 my-2">Others</p>
        <Form
          method="POST"
          action="/logout"
          className="w-full"
        >
          <Button
            className="w-full justify-start gap-2 hover:bg-primary"
            variant="ghost"
          >
            <LogOut
              strokeWidth={1.5}
              size={20}
            />
            Logout
          </Button>
        </Form>
      </div>
    </>
  );
}

const BottomNav = () => {
  return (
    <div className="w-full block md:hidden p-2">
      <div className="grid grid-cols-4 items-stretch">
        {BottomLinks.map((link) => (
          <GNavLink
            key={link.to}
            end
            to={link.to}
            className={({ isActive }) =>
              cn(
                "block rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : ""
              )
            }
          >
            <div className="w-full flex flex-col items-center p-2 gap-2">
              {link.icon}
              {/* <span>{link.name}</span> */}
            </div>
          </GNavLink>
        ))}
      </div>
    </div>
  );
};
