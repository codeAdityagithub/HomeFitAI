import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { useMemo } from "react";

const chartConfig = {
  sets: {
    label: "Sets",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ExercisesChart({
  logs,
}: {
  logs: SerializeFrom<Log>[];
}) {
  const chartData = useMemo(() => {
    // get exercise sets from the log
    const exercises = logs.reduce(
      (acc, log) =>
        acc.concat(
          log.exercises.map((e) => ({ target: e.target, sets: e.sets.length }))
        ),
      [] as { target: string; sets: number }[]
    );

    // aggregate sets by target
    const count = exercises.reduce((acc, e) => {
      if (!acc[e.target]) {
        acc[e.target] = e.sets;
      } else {
        acc[e.target] += e.sets;
      }
      return acc;
    }, {} as { [target: string]: number });

    return Object.entries(count).map(([target, count]) => ({
      target,
      sets: count,
    }));
  }, [logs]);
  const mostSetsExercise = useMemo(
    () => chartData.reduce((a, b) => (a.sets > b.sets ? a : b), chartData[0]),
    [chartData]
  );
  // console.log(mostSetsExercise);
  return (
    <Card className="bg-secondary/50">
      <CardHeader className="items-start pb-4">
        <CardTitle>Exercise Volume Distribution</CardTitle>
        <CardDescription>
          Exercise volume distribution for various body parts of past{" "}
          {/* <span className="text-accent font-semibold">7</span> days. */}7
          days
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <PolarGrid
              gridType="circle"
              radialLines={false}
            />
            <PolarAngleAxis dataKey="target" />
            <Radar
              dataKey="sets"
              fill="var(--color-sets)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <p className="leading-4 text-muted-foreground">
          You have performed exercises for{" "}
          <span className="text-secondary-foreground font-medium">
            {chartData.length}
          </span>{" "}
          different body parts in the past {logs.length} sessions
        </p>
        <div className="w-full flex gap-2 leading-4 text-muted-foreground">
          Body part with the most sets :{" "}
          <span className="text-secondary-foreground font-medium capitalize">
            {mostSetsExercise.target}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
