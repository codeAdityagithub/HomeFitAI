import { cn } from "@/lib/utils";
import { NavLink, Outlet } from "@remix-run/react";
import { NavLinkRenderProps } from "react-router-dom";

const SocialLayout = () => {
  const activeClassName = ({ isActive }: NavLinkRenderProps) => {
    return cn(
      "rounded-md text-xs ssm:text-sm px-2 py-1 text-foreground/60 transition-colors duration-300",
      isActive ? "bg-accent text-accent-foreground" : ""
    );
  };
  return (
    <section className="flex flex-col rounded-md items-start bg-muted absolute inset-0 overflow-auto ver_scroll">
      <div className="flex flex-col px-4 pt-4 ssm:flex-row items-start gap-2 ssm:gap-4 sticky z-50 top-0 bg-muted">
        <h2 className="text-xl ssm:text-2xl font-bold border-none ssm:border-b text-foreground/80 ssm:border-foreground/80">
          Home<span className="text-primary">Fit</span> Social
        </h2>
        <div className="flex items-center gap-1 bg-background text-foreground p-1 rounded-lg">
          <NavLink
            className={activeClassName}
            to="challenges"
          >
            Challenges
          </NavLink>
          <NavLink
            className={activeClassName}
            to="group"
          >
            Group
          </NavLink>
        </div>
      </div>

      <Outlet />
    </section>
  );
};
export default SocialLayout;
