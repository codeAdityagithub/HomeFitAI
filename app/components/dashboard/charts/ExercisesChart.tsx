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
  duration: {
    label: "Minutes",
    color: "hsl(var(--accent))",
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
          log.exercises.map((e) => ({
            target: e.target,
            sets: e.sets.length,
            duration: e.target === "cardio" ? e.duration : undefined,
          }))
        ),
      [] as { target: string; sets: number; duration?: number }[]
    );

    // aggregate sets by target
    const count = exercises.reduce((acc, e) => {
      if (!acc[e.target]) {
        if (e.duration) acc[e.target] = e.duration;
        else acc[e.target] = e.sets;
      } else {
        if (e.duration) acc[e.target] += e.duration;
        else acc[e.target] += e.sets;
      }
      return acc;
    }, {} as { [target: string]: number });

    return Object.entries(count).map(([target, count]) => {
      if (target === "cardio") return { target, duration: count / 2 };
      return { target, sets: count };
    });
  }, [logs]);
  const mostSetsExercise = useMemo(
    () =>
      chartData.reduce(
        (a, b) =>
          !a.sets || !b.sets
            ? { target: "", sets: -1 }
            : a.sets > b.sets
            ? a
            : b,
        chartData[0]
      ),
    [chartData]
  );

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
              content={
                <ChartTooltipContent
                  formatter={(value, name, item, index) => {
                    // console.log(value);
                    return (
                      <>
                        <div className="flex w-full items-center text-xs text-muted-foreground">
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {
                              // @ts-expect-error
                              name === "sets" ? value : (value * 2).toFixed(1)
                            }
                          </div>
                        </div>
                      </>
                    );
                  }}
                />
              }
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
            <Radar
              dataKey="duration"
              fill="var(--color-duration)"
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
