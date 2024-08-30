import {
  Link,
  LinkProps,
  useLocation,
  useResolvedPath,
} from "@remix-run/react";

const GLink = (props: LinkProps) => {
  const location = useLocation();
  const path = useResolvedPath(props.to);

  return (
    <Link
      onClick={(e) => {
        if (
          location.pathname === path.pathname &&
          location.search === path.search
        )
          e.preventDefault();
      }}
      {...props}
    ></Link>
  );
};
export default GLink;
