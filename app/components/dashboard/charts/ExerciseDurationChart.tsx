import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";

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
import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { useMemo } from "react";

export default function ExerciseDurationChart({
  logs,
}: {
  logs: SerializeFrom<Log>[];
}) {
  const { chartData, avgDuration } = useMemo(() => {
    let totalDuration = 0;
    const chartData = logs
      .map((log, ind) => {
        const duration = log.exercises.reduce((a, b) => a + b.duration, 0);
        totalDuration += duration;
        return {
          date: log.date,
          duration: duration,
          exercises: log.exercises.length,
        };
      })
      .reverse();
    return {
      chartData,
      avgDuration: (totalDuration / logs.length).toFixed(1),
    };
  }, [logs]);

  return (
    <Card className="lg:max-w-md bg-secondary/50">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle>Exercise Duration</CardTitle>
        <CardDescription>
          Exercise duration over the past 7 sessions
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
          Over the past 7 sessions, your average workout duration was{" "}
          <span className="font-medium text-foreground">{avgDuration}</span>{" "}
          minutes.
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
