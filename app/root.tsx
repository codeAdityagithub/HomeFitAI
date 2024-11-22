import stylesheet from "@/tailwind.css?url";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useNavigate,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { cn } from "./lib/utils";
import { getAuthUser } from "./utils/auth/auth.server";
import { themeCookie } from "./utils/themeCookie.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthUser(request);
  const theme: string = await themeCookie.parse(request.headers.get("Cookie"));
  if (!theme) {
    return json(
      { theme: "dark", user },
      {
        headers: {
          "Set-Cookie": await themeCookie.serialize("dark"),
        },
      }
    );
  }

  return { user, theme };
};

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  return formAction === "/logout" || formAction === "/api/changeTheme";
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useRouteLoaderData("root") as any;
  return (
    <html
      lang="en"
      className={cn("scroll-smooth", theme)}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body className="ver_scroll min-h-[500px]">
        {children}
        <ScrollRestoration
        // getKey={(location, matches) => {
        //   // default behavior
        //   return location.pathname;
        // }}
        />
        <Scripts />
      </body>
    </html>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex items-center justify-center h-svh">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>
              {error.status} {error.statusText}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.data}</p>
          </CardContent>
          <CardFooter className="gap-4">
            <Link to="/">
              <Button>Back to HomePage</Button>
            </Link>

            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex items-center justify-center h-svh">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Error!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error.message}</p>
          </CardContent>
          <CardFooter>
            <Link to="/">
              <Button>Back to HomePage</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default function App() {
  return <Outlet />;
}
