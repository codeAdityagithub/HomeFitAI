import { cn } from "@/lib/utils";

const features = [
  {
    title: "Personalized Workout Playlists",
    description:
      "Create and access playlists with calorie burn estimates tailored to you.",

    image: "/images/workout-playlists.png",
  },
  {
    title: "Daily Log Management & Insights",
    description:
      "Track your daily water, steps, sleep, and calories with detailed analytics and progress graphs.",
    long_desc:
      "Monitor your water intake, steps, sleep, and calories daily. Visualize your progress with insightful graphs and dive deep into the details of your last 7 workouts, including sets, reps, duration, and weights used.",
    image: "/images/daily-log.png",
  },
  {
    title: "Home-Friendly Workouts",
    description:
      "80+ exercises designed for home fitness, with or without dumbbells.",
    long_desc:
      "'Explore a versatile library of workouts tailored for home fitness, whether you're using just your body weight or a dumbbell. Stay fit without needing a full gym setup!",
    image: "/images/home-workouts.png",
  },
  {
    title: "Group Workouts & Community",
    description:
      "Join groups, share goals, and celebrate achievements with friends.",
    image: "/images/group-workouts.png",
  },
  {
    title: "Achievements & Daily Goals",
    description:
      "Earn achievements and stay motivated by setting and completing goals.",
    image: "/images/achievements.png",
  },
  {
    title: "Your Fitness Journey at a Glance",
    description:
      "View your fitness stats, streaks, and total progress in one place.",
    long_desc:
      "View your detailed fitness profile with stats like current and best streaks, total steps, workouts completed, and calories burned over time. Celebrate how far you've come!",
    image: "/images/fitness-journey.png",
  },
  {
    title: "Guided Workouts with Videos",
    description:
      "Learn proper form with concise videos and personalized calorie estimates.",
    long_desc:
      "Each workout comes with a concise YouTube video explaining how to perform it correctly. Plus, get personalized calorie burn estimates tailored to your unique physique.",
    image: "/images/expert-videos.png",
  },
  {
    title: "AI-Powered Workout Detection",
    description:
      "Use your camera to detect reps, get feedback, and track workout goals.",
    image: "/images/workout-detection.png",
  },
];
const Features = () => {
  return (
    <section
      id="features"
      className="py-8 scroll-mt-8"
    >
      <h1 className="text-primary text-4xl font-bold drop-shadow-md text-center">
        Features
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 py-8 px-8 lg:px-0 grid-flow-dense">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={cn(
              "p-6 border border-accent/20 hover:border-accent/40 relative rounded-lg shadow-md shadow-foreground/10 hover:shadow-lg bg-secondary text-secondary-foreground transition-all transform",

              (index % 4 === 1 || index % 4 === 2) && "lg:col-span-4",
              (index % 4 === 0 || index % 4 === 3) && "lg:col-span-2"
            )}
          >
            <img
              src={`/features/pic${index + 2}.png`}
              alt={feature.title}
              className="w-full h-48 lg:h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-2 tracking-wide text-accent">
              {feature.title}
            </h2>
            {feature.long_desc ? (
              <>
                <p className="text-sm text-secondary-foreground/80 leading-relaxed hidden lg:block">
                  {feature.long_desc}
                </p>
                <p className="text-sm text-secondary-foreground/80 leading-relaxed lg:hidden">
                  {feature.description}
                </p>
              </>
            ) : (
              <p className="text-sm text-secondary-foreground/80 leading-relaxed">
                {feature.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
export default Features;
