import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Rectangle,
  XAxis,
  YAxis,
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
import { convertToLbs } from "@/lib/utils";
import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

function WeightChart({ logs }: { logs: SerializeFrom<Log>[] }) {
  const { stats } = useDashboardLayoutData();

  return (
    <Card className="flex flex-col bg-secondary/50 lg:max-w-md">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 relative [&>div]:flex-1">
        <Link
          className="absolute top-2 right-2"
          to="profile"
          title="Edit Weight and Goal Weight"
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9"
          >
            <SquareArrowOutUpRight size={20} />
          </Button>
        </Link>
        <div>
          <CardDescription>Weight</CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {stats.unit === "kgcm"
              ? stats.weight.toFixed(1)
              : convertToLbs(stats.weight).toFixed(1)}{" "}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              {stats.unit === "kgcm" ? "kg" : "lbs"}
            </span>
          </CardTitle>
        </div>
        <div>
          <CardDescription>Goal Weight</CardDescription>
          <CardTitle className="text-4xl tabular-nums">
            {stats.unit === "kgcm"
              ? stats.goalWeight.toFixed(1)
              : convertToLbs(stats.goalWeight).toFixed(1)}{" "}
            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
              {stats.unit === "kgcm" ? "kg" : "lbs"}
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer
          config={{
            weight: {
              label: "Weight",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="w-full"
        >
          <LineChart
            accessibilityLayer
            margin={{
              left: 14,
              right: 14,
              top: 10,
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
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <YAxis
              hide
              domain={["dataMin - 10", "dataMax + 10"]}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Line
              dataKey="weight"
              type="natural"
              fill="var(--color-weight)"
              stroke="var(--color-weight)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                fill: "var(--color-weight)",
                stroke: "var(--color-weight)",
                r: 4,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
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
          </LineChart>
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
