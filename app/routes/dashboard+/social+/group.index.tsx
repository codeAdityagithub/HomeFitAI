import createGroup from "@/.server/handlers/social/createGroup";
import getGroup from "@/.server/loaders/social/getGroup";
import CreateGroupPage from "@/components/social/CreateGroupPage";
import GroupRoute from "@/components/social/GroupRoute";
import { requireUser } from "@/utils/auth/auth.server";
import { ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, { failureRedirect: "/login" });
  return await getGroup(user);
};

export type GroupLoader = typeof loader;

export const action = async ({ request }: ActionFunctionArgs) => {
  return await createGroup(request);
};

export { clientLoader } from "@/utils/routeCache.client";
export type SocialAction = typeof action;

const GroupPage = () => {
  const { group } = useLoaderData<typeof loader>();
  if (!group) return <CreateGroupPage />;
  return <GroupRoute group={group} />;
};
export default GroupPage;
