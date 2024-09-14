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
  const avgSteps = (
    logs.reduce((sum, log) => sum + log.steps, 0) / logs.length
  ).toFixed(1);
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
              defaultIndex={2}
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
      {/* <CardFooter className="flex-col items-start gap-1">
          <CardDescription>
            Over the past 7 days, you have walked{" "}
            <span className="font-medium text-foreground">53,305</span> steps.
          </CardDescription>
          <CardDescription>
            You need <span className="font-medium text-foreground">12,584</span>{" "}
            more steps to reach your goal.
          </CardDescription>
        </CardFooter> */}
    </Card>
  );
}
export default StepsChart;
