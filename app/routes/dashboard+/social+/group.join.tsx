import joinGroupLoader from "@/.server/loaders/social/joinGroupLoader";
import GroupInfoCard from "@/components/social/GroupInfoCard";
import JoinGroupPage from "@/components/social/JoinGroupPage";
import { useToast } from "@/hooks/use-toast";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) =>
  await joinGroupLoader(request);

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

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
  return <GroupInfoCard />;
}
