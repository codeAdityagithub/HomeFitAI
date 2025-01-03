import createGroup from "@/.server/handlers/social/createGroup";
import getGroup from "@/.server/loaders/social/getGroup";
import CreateGroupPage from "@/components/social/CreateGroupPage";
import GroupRoute from "@/components/social/GroupRoute";
import { requireUser } from "@/utils/auth/auth.server";
import { deleteKey } from "@/utils/routeCache.client";
import {
  ActionFunctionArgs,
  MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      title: `${
        data?.group?.name ?? "Social Groups"
      } - Connect & Share | HomeFitAI`,
    },
    { property: "og:title", content: "Join Fitness Social Groups" },
    {
      name: "description",
      content:
        "Join fitness social groups, share progress, and motivate others in the HomeFitAI community.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  return await getGroup(user);
};

export type GroupLoader = typeof loader;

export const action = async ({ request }: ActionFunctionArgs) => {
  return await createGroup(request);
};

export { clientAction, clientLoader } from "@/utils/routeCache.client";
export type SocialAction = typeof action;

const GroupPage = () => {
  const { group, membersInfo } = useLoaderData<typeof loader>();
  if (!group) return <CreateGroupPage />;
  const revalidator = useRevalidator();

  // Revalidate the data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      deleteKey(window.location.pathname);
      revalidator.revalidate();
    }, 15000);

    return () => clearInterval(interval);
  }, []);
  return (
    <GroupRoute
      group={group}
      membersInfo={membersInfo}
    />
  );
};
export default GroupPage;
