import { Achievement } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

const Achievements = ({
  achievements,
}: {
  achievements: SerializeFrom<Achievement>[];
}) => {
  achievements = [
    {
      id: "60c72b2f9b1e8d3e1a3f6c5b", // Example ObjectId
      title: "First Workout",
      description: "Completed your first workout session!",
      type: "FIRST_WORKOUT",
      userId: "60c72b2f9b1e8d3e1a3f6c5a", // Example user ObjectId
      createdAt: "2024-08-18",
    },
    {
      id: "60c72b2f9b1e8d3e1a3f6c6b",
      title: "100 Workouts Milestone",
      description: "Completed 100 workouts!",
      type: "GOAL_ACHIEVED",
      userId: "60c72b2f9b1e8d3e1a3f6c5a",
      createdAt: "2024-08-18",
    },
    {
      id: "60c72b2f9b1e8d3e1a3f6c7b",
      title: "Challenge Completed",
      description: "Successfully completed the 30-day fitness challenge!",
      type: "MILESTONE_REACHED",
      userId: "60c72b2f9b1e8d3e1a3f6c5a",
      createdAt: "2024-08-18",
    },
  ];
  return (
    <div className="w-full grid grid-cols-1 xs:grid-cols-2 llg:grid-cols-4 items-stretch gap-4">
      {achievements.map((a) => (
        <div
          key={a.id}
          className="rounded-lg p-2 sm:p-4 border border-accent/10 bg-secondary flex items-center gap-4"
        >
          <span>Icon</span>
          <div className="flex flex-col items-start">
            <h2 className="text-lg sm:text-xl font-bold">{a.title}</h2>
            <small className="text-muted-foreground">
              {new Date(a.createdAt).toDateString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Achievements;
