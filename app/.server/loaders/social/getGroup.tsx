import { AuthUser } from "@/services/auth.server";
import { stable_cache } from "@/utils/cache/cache.server";
import db from "@/utils/db.server";
import { DailyGoals, GroupMember } from "@prisma/client";
import { json } from "@remix-run/node";
import { DateTime } from "luxon";

export default async function getGroup(user: AuthUser) {
  try {
    const dbuser = await db.user.findUnique({
      where: { id: user.id },
      select: { groupId: true },
    });
    if (!dbuser) throw json({ error: "User not found" }, { status: 404 });

    const groupId = dbuser.groupId;

    if (!groupId) return { group: null, membersInfo: null };
    const group = await db.group.findUnique({
      where: { id: groupId },
    });
    if (!group) return { group: null, membersInfo: null };

    const membersInfo = await getGroupMembers(group?.members, user, group.id);

    return { group, membersInfo };
  } catch (error) {
    console.log(error);
    throw new Error("Something went Wrong while getting group data");
  }
}

function getMemberStatAndLog(id: string, date: Date) {
  const pr = Promise.all([
    db.stats.findUnique({
      where: { userId: id },
      select: { dailyGoals: true, userId: true },
    }),
    db.log.findUnique({
      where: {
        date_userId: { date, userId: id },
      },
      select: {
        sleep: true,
        steps: true,
        totalCalories: true,
        waterIntake: true,
        exercises: { select: { name: true, sets: { select: { reps: true } } } },
      },
    }),
  ]);
  return pr;
}

type MemberInfoLog = {
  totalCalories: number;
  exercises: {
    name: string;
    sets: {
      reps: number;
    }[];
  }[];
  steps: number;
  sleep: number;
  waterIntake: number;
};

const getGroupMembers = stable_cache(
  async (members: GroupMember[], user: AuthUser, groupId: string) => {
    const promises = [] as ReturnType<typeof getMemberStatAndLog>[];
    // console.log("cache called");
    const todaysDate = DateTime.now().setZone(user.timezone!);

    if (!todaysDate.isValid)
      throw new Error(
        "Invalid timezone settings! Please logout and login again."
      );

    const date = new Date(todaysDate.toISODate());

    for (const member of members) {
      promises.push(getMemberStatAndLog(member.id, date));
    }

    const membersInfo = await Promise.all(promises);
    // console.log(membersInfo);
    const res = membersInfo.reduce((acc, cur) => {
      const userId = cur[0]?.userId!;
      // @ts-expect-error
      if (!acc[userId]) acc[userId] = {};

      acc[userId].dailyGoals = cur[0]?.dailyGoals!;
      acc[userId].log = cur[1];

      return acc;
    }, {} as Record<string, { dailyGoals: DailyGoals; log: MemberInfoLog | null }>);

    return res;
  },
  {
    tags: (args) => [args[2], "info"],
    revalidateAfter: 600,
  }
);
