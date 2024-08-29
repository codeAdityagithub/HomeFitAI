import { Outlet } from "@remix-run/react";
import { Quote } from "lucide-react";
import { FaQuoteLeft } from "react-icons/fa";

const AuthLayout = () => {
  return (
    <div className="h-svh flex relative">
      <div className="h-full flex-1 overflow-hidden absolute -z-10 md:relative">
        <img
          src="personRunning.jpg"
          alt="personRunning image"
          className="h-full w-full object-cover"
        />
        <div className="mb-6 absolute inset-0 hidden md:flex items-center justify-center">
          <blockquote className="text-2xl relative italic font-serif font-semibold p-2 rounded border border-black/20 drop-shadow-lg text-primary backdrop-blur-sm bg-white/80 max-w-xs text-center">
            <FaQuoteLeft className="absolute text-black -top-2 -left-2" />
            The hardest step is showing up—you're already halfway there.
          </blockquote>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
export default AuthLayout;
