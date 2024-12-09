import { verifyTokenAndJoin } from "@/.server/handlers/social/joinLink";
import joinGroupLoader from "@/.server/loaders/social/joinGroupLoader";
import GroupInfoCard from "@/components/social/GroupInfoCard";
import JoinGroupPage from "@/components/social/JoinGroupPage";
import { useToast } from "@/hooks/use-toast";
import { requireUser } from "@/utils/auth/auth.server";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Join a Fitness Group - Connect & Collaborate | HomeFitAI" },
    { property: "og:title", content: "Join a Fitness Group - HomeFitAI" },
    {
      name: "description",
      content:
        "Find and join fitness groups that match your goals. Collaborate with like-minded individuals and stay motivated with HomeFitAI.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) =>
  await joinGroupLoader(request);

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return json({ error: "No token provided", message: null }, { status: 400 });
  }
  return await verifyTokenAndJoin(token, user);
};

export type JoinGroupAction = typeof action;

export default function RouteComponent() {
  const { group, error } = useLoaderData<typeof loader>();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  if (!group) return <JoinGroupPage />;
  return <GroupInfoCard group={group} />;
}
