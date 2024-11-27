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
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

function StepsChart({ logs }: { logs: SerializeFrom<Log>[] }) {
  const { log } = useDashboardLayoutData();
  const avgSteps = Math.round(
    logs.reduce((sum, log) => sum + log.steps, 0) / logs.length
  );
  // console.log(log);
  return (
    <Card className="lg:max-w-md bg-secondary/50">
      <CardHeader className="space-y-0 pb-2">
        <CardDescription>Steps</CardDescription>
        <CardTitle className="text-4xl tabular-nums">
          {log.steps}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            steps
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            steps: {
              label: "Steps",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <BarChart
            accessibilityLayer
            margin={{
              left: -4,
              right: -4,
            }}
            data={logs
              .map((log) => ({
                steps: log.steps,
                date: log.date,
              }))
              .reverse()}
          >
            <Bar
              dataKey="steps"
              fill="var(--color-steps)"
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
              defaultIndex={1}
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
                />
              }
              cursor={false}
            />
            <ReferenceLine
              y={avgSteps}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Average Steps"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={avgSteps}
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
          Over the past {logs.length} sessions, you have walked{" "}
          <span className="font-medium text-foreground">{avgSteps}</span> steps
          on average per day.
        </CardDescription>
        <CardDescription>
          {avgSteps < 5000 &&
            "Your weekly average shows low activity. Try to increase your daily steps for better health."}
          {avgSteps >= 5000 &&
            avgSteps <= 10000 &&
            "You're maintaining a solid activity level! Keep going to hit your health goals."}
          {avgSteps > 10000 &&
            "Impressive! Your weekly average steps show you're highly active—keep up the great work!"}
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
export default StepsChart;
