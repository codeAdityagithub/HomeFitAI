import { Flame } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { cn } from "@/lib/utils";
import { stepsToCal } from "@/utils/general";
import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { useMemo } from "react";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-2))",
  },
  exercise: {
    label: "Exercise",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function evaluateCaloriesBurned(avgCalories: number, goalCalories: number) {
  // Compare average calories burned to goal calories
  if (avgCalories >= goalCalories) {
    return `Great job! You've met your daily goal by burning an average of ${avgCalories} calories per day. Keep up the good work!`;
  } else {
    return (
      <span>
        You're almost there!. Try to reach your daily goal of
        <span className="font-medium text-secondary-foreground">
          {" "}
          {goalCalories}
        </span>{" "}
        calories to get even better results!;
      </span>
    );
  }
}

export default function CaloriesSourceChart({
  logs,
}: {
  logs: SerializeFrom<Log>[];
}) {
  const { stats } = useDashboardLayoutData();
  const { chartData, totalWeekCalories } = useMemo(() => {
    let totalWeekCalories = 0;

    const chartData = logs
      .map((log, ind) => {
        const caloriesFromSteps = Math.floor(
          stepsToCal(stats.height, stats.weight, log.steps)
        );
        const totalCalories =
          log.totalCalories + (ind === 0 ? caloriesFromSteps : 0);
        totalWeekCalories += totalCalories;
        return {
          date: log.date,
          steps: caloriesFromSteps,
          exercise: totalCalories - caloriesFromSteps,
          total: totalCalories,
        };
      })
      .reverse();
    return { chartData, totalWeekCalories };
  }, [logs, stats]);
  const avgCalories = useMemo(
    () =>
      (
        logs.reduce((acc, log) => acc + log.totalCalories, 0) /
        (logs.length || 1)
      ).toFixed(1),
    [logs]
  );
  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle>Calorie Expenditure</CardTitle>
        <CardDescription>
          Source of calories expenditure in the past 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item, index) => (
                    <>
                      {index === 0 && (
                        <div className="w-full">
                          {new Date(item.payload.date).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </div>
                      )}
                      <div className="flex w-full items-center text-xs text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {value}
                          <span className="font-normal text-muted-foreground">
                            kcal
                          </span>
                        </div>
                      </div>
                      {index === 1 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                          Total
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground">
                            {item.payload.steps + item.payload.exercise}
                            <span className="font-normal text-muted-foreground">
                              kcal
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="steps"
              stackId="a"
              fill="var(--color-steps)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="exercise"
              stackId="a"
              fill="var(--color-exercise)"
              radius={[4, 4, 0, 0]}
            />
            {/* <ReferenceLine
              y={stats.dailyGoals.calories}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Daily Calorie Goal"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={stats.dailyGoals.calories}
                className="text-base"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 text-muted-foreground leading-4">
          <p>
            Average Calorie Expenditure was{" "}
            <span className="text-secondary-foreground font-medium">
              {avgCalories} kcal
            </span>{" "}
            in the past {logs.length} sessions.
          </p>
        </div>
        <div className="flex gap-2 text-muted-foreground leading-4">
          <p>
            Total Calories Burned :{" "}
            <span className="text-secondary-foreground inline-flex w-fit gap-1 font-medium">
              {totalWeekCalories} kcal
              <Flame className="h-4 w-4 text-primary" />
            </span>
            in past {logs.length} sessions
          </p>
        </div>
        <p className={cn(logs.length < 2 ? "hidden" : "text-muted-foreground")}>
          {evaluateCaloriesBurned(
            Number(avgCalories),
            stats.dailyGoals.calories
          )}
        </p>
      </CardFooter>
    </Card>
  );
}
