import { Bar, BarChart, Rectangle, XAxis } from "recharts";

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
import { convertToLbs } from "@/lib/utils";
import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

function WeightChart({ logs }: { logs: SerializeFrom<Log>[] }) {
  const { stats } = useDashboardLayoutData();
  return (
    <Card className="lg:max-w-md bg-secondary/50">
      <CardHeader className="space-y-0 pb-2">
        <CardDescription>Weight</CardDescription>
        <CardTitle className="text-4xl tabular-nums">
          {stats.unit === "kgcm"
            ? stats.weight.toFixed(1)
            : convertToLbs(stats.weight).toFixed(1)}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            {stats.unit === "kgcm" ? "kg" : "lbs"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            weight: {
              label: "Weight",
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
                weight:
                  stats.unit === "kgcm"
                    ? log.weight
                    : convertToLbs(log.weight).toFixed(1),
                date: log.date,
              }))
              .reverse()}
          >
            <Bar
              dataKey="weight"
              fill="var(--color-weight)"
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
            {/* <ReferenceLine
              y={
                stats.unit === "kgcm"
                  ? stats.goalWeight
                  : convertToLbs(stats.goalWeight).toFixed(1)
              }
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Goal Weight"
                offset={10}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={
                  stats.unit === "kgcm"
                    ? stats.goalWeight
                    : convertToLbs(stats.goalWeight).toFixed(1)
                }
                className="text-lg"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine> */}
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
export default WeightChart;
