import { Group } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

const GroupRoute = ({ group }: { group: SerializeFrom<Group> }) => {
  return <div>GroupRoute</div>;
};
export default GroupRoute;
