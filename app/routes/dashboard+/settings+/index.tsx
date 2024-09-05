import { authenticator } from "@/services/auth.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/utils/userContext";
import { AlignVerticalJustifyStartIcon } from "lucide-react";
import db from "@/utils/db.server";
import { useLoaderData } from "@remix-run/react";
import { IoPersonOutline } from "react-icons/io5";
import { requireUser } from "@/utils/auth/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request, {
    failureRedirect: "/login",
  });
  const dbuser = await db.user.findUnique({ where: { id: user.id } });
  if (!dbuser) return await authenticator.logout(request, { redirectTo: "/" });

  return { user: dbuser };
};

const DashboardSettings = () => {
  const { user } = useLoaderData<typeof loader>();
  // console.log(user);
  return (
    <Card className="h-full flex flex-col gap-2 border-none rounded-none shadow-none">
      <CardHeader className="flex flex-col relative items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage
            alt={user.username}
            src={user.image ?? ""}
          ></AvatarImage>
          <AvatarFallback>
            <IoPersonOutline className="w-full h-full p-2" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-medium">{user?.username}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        breaker with text Personal
        <div className="">Link to playlists</div>
        breaker with text preferences
        <div className="">Link to darkmode</div>
        <div className="">Link to logout</div>
      </CardContent>
    </Card>
  );
};

export default DashboardSettings;
