import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import useDashboardLayoutData from "@/hooks/useDashboardLayout";
import { Log } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  opera: {
    label: "Opera",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
export const description = "A radial chart with a custom shape";
const chartData = [
  { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
  { browser: "opera", visitors: 600, fill: "var(--color-opera)" },
];
function WaterChart({ logs }: { logs: SerializeFrom<Log>[] }) {
  const { log, stats } = useDashboardLayoutData();

  return (
    <Card
      className="lg:max-w-md bg-secondary/50"
      x-chunk="charts-01-chunk-7"
    >
      <CardHeader className="space-y-0 pb-0">
        <CardDescription>Water Intake</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          {log.waterIntake}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            glasses
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="visitors"
              background
            />
            <PolarRadiusAxis
              tick={false}
              tickLine={false}
              axisLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1">
        <CardDescription>
          Over the past 7 days, your average daily water intake was{" "}
        </CardDescription>
        <CardDescription></CardDescription>
      </CardFooter>
    </Card>
  );
}
export default WaterChart;
