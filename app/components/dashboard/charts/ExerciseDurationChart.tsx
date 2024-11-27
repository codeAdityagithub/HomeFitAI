import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Log } from "@prisma/client";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { SerializeFrom } from "@remix-run/node";
import { Info } from "lucide-react";
import { useMemo } from "react";

function evaluateExerciseDuration(avgDuration: number) {
  // Define thresholds (adjust as needed)
  const adequateThreshold = 20; // Minimum recommended daily duration (in minutes)
  const excellentThreshold = 60; // Duration indicating high activity (in minutes)

  // Generate a message based on the average duration
  if (avgDuration >= excellentThreshold) {
    return "Excellent! You're exercising for a great amount of time daily. Keep it up!";
  } else if (avgDuration >= adequateThreshold) {
    return "Good job! You're meeting the recommended daily exercise duration. Stay consistent!";
  } else {
    return "You might want to increase your daily exercise duration to at least 30 minutes for better results.";
  }
}

export default function ExerciseDurationChart({
  logs,
}: {
  logs: SerializeFrom<Log>[];
}) {
  const { chartData, avgDuration, avgExercises, totalSession } = useMemo(() => {
    let totalDuration = 0,
      totalExercises = 0,
      totalSession = 0;
    const chartData = logs
      .map((log, ind) => {
        const duration = log.exercises.reduce(
          (a, b) => a + b.duration + b.sets.length * 3,
          0
        );
        totalExercises += log.exercises.length;
        totalSession += log.exercises.length > 0 ? 1 : 0;
        totalDuration += duration;

        return {
          date: log.date,
          duration: Number(duration.toFixed(1)),
          exercises: log.exercises.length,
        };
      })
      .reverse();

    return {
      chartData,
      avgDuration: (totalDuration / totalSession).toFixed(1),
      avgExercises: Math.round(totalExercises / totalSession),
      totalSession,
    };
  }, [logs]);

  return (
    <Card className="lg:max-w-md bg-secondary/50">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="w-full flex justify-between">
          Exercise Duration
          <Popover>
            <PopoverTrigger
              className="ml-auto"
              asChild
            >
              <Button
                size="icon"
                className="w-7 h-7"
                variant="ghost"
              >
                <Info size={20} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="text-xs">
              This Assumes a 3 min rest between sets
            </PopoverContent>
          </Popover>
        </CardTitle>
        <CardDescription>
          Exercise duration over the past {logs.length} sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            duration: {
              label: "Duration (min)",
              color: "hsl(var(--chart-3))",
            },
            exercises: {
              label: "Exercises",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: -4,
              right: -4,
            }}
            data={chartData}
          >
            <Bar
              dataKey="duration"
              fill="var(--color-duration)"
              radius={5}
              fillOpacity={0.6}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <ChartTooltip
              // defaultIndex={1}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name, item, index) => (
                    <>
                      {index === 0 && (
                        <div className="flex w-full items-center text-xs text-muted-foreground">
                          Exercises
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {item.payload.exercises}
                            <span className="font-normal text-muted-foreground"></span>
                          </div>
                        </div>
                      )}
                      <div className="flex w-full items-center text-xs text-muted-foreground">
                        {name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {value} min
                          <span className="font-normal text-muted-foreground"></span>
                        </div>
                      </div>
                    </>
                  )}
                />
              }
              cursor={false}
            />
            <ReferenceLine
              y={avgDuration}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Average Duration"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={avgDuration}
                className="text-lg"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1">
        <CardDescription>
          Over the past {logs.length} sessions, your average workout duration
          was <span className="font-medium text-foreground">{avgDuration}</span>{" "}
          minutes.
        </CardDescription>
        <CardDescription>
          Average exercises per session was{" "}
          <span className="font-medium text-foreground">{avgExercises}</span>{" "}
        </CardDescription>
        <CardDescription>
          {evaluateExerciseDuration(Number(avgDuration))}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
