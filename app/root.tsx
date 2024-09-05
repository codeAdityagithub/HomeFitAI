import stylesheet from "@/tailwind.css?url";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useRouteError,
} from "@remix-run/react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { getAuthUser } from "./utils/auth/auth.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthUser(request);
  
  return { user };
};

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  return formAction === "/logout";
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();

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
          <CardFooter>
            <Link to="/">
              <Button>Back to HomePage</Button>
            </Link>
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
