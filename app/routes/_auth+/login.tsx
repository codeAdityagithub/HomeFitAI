import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { redirectIfAuth } from "@/utils/auth/auth.server";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { FaGoogle } from "react-icons/fa";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfAuth(request, {
    successRedirect: "/details",
  });

  return null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Access Your HomeFitAI Account" },
    { property: "og:title", content: "Login to HomeFitAI" },
    {
      name: "description",
      content:
        "Sign in to your HomeFitAI account to access personalized fitness plans, track progress, and stay motivated.",
    },
    {
      property: "og:description",
      content:
        "Log in to HomeFitAI to manage your workouts, view your fitness logs, and join our community.",
    },
  ];
};

export default function LoginForm() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="bg-white/60 backdrop-blur-sm">
        <CardContent className="w-[300px] mt-6">
          <Form
            action="/auth/google"
            method="post"
          >
            <Button
              type="submit"
              className="w-full"
            >
              Login with <FaGoogle className="text-xl ml-2" />
              oogle
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
