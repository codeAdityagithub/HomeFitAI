import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return { data: "playlist" };
};

export { clientLoader } from "@/utils/routeCache.client";

const PlaylistPage = () => {
  return <div>PlaylistPage</div>;
};
export default PlaylistPage;
