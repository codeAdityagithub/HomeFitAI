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
import { Area, AreaChart, XAxis, YAxis } from "recharts";

function SleepChart({ logs }: { logs: SerializeFrom<Log>[] }) {
  const { log } = useDashboardLayoutData();
  return (
    <Card
      className="max-w-md bg-secondary/50"
      x-chunk="charts-01-chunk-7"
    >
      <CardHeader className="space-y-0 pb-0">
        <CardDescription>Sleep</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          {log.sleep}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            hr
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            time: {
              label: "Time",
              color: "hsl(var(--chart-2))",
            },
          }}
        >
          <AreaChart
            accessibilityLayer
            data={logs
              .map((log) => ({
                time: log.sleep,
                date: log.date,
              }))
              .reverse()}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="date"
              hide
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 2"]}
              hide
            />
            <defs>
              <linearGradient
                id="fillTime"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-time)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-time)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="time"
              type="natural"
              fill="url(#fillTime)"
              fillOpacity={0.4}
              stroke="var(--color-time)"
            />
            <ChartTooltip
              cursor={false}
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
              formatter={(value) => (
                <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                  Sleep
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">
                      hr
                    </span>
                  </div>
                  {}
                </div>
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
export default SleepChart;
