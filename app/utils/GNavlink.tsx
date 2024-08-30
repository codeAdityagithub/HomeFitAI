import {
  NavLink,
  NavLinkProps,
  useLocation,
  useResolvedPath,
} from "@remix-run/react";

const GNavLink = (props: NavLinkProps) => {
  const location = useLocation();
  const path = useResolvedPath(props.to);
  return (
    <NavLink
      onClick={(e) => {
        if (
          location.pathname === path.pathname &&
          location.search === path.search
        )
          e.preventDefault();
      }}
      {...props}
    ></NavLink>
  );
};
export default GNavLink;
