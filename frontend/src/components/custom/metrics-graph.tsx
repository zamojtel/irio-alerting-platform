import type {
  ExtendedStatusMetricsEntry,
  Granularity,
  StatusMetrics,
} from "@/lib/api/service";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { unreachable } from "@/lib/utils";
import { useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "../ui/tabs";

const formatDate = (dateStr: string, granularity: Granularity) => {
  const date = parseISO(dateStr);

  switch (granularity) {
    case "minute":
      return format(date, "HH:mm");
    case "hour":
      return format(date, "HH:00");
    case "day":
      return format(date, "dd MMM");
    case "week":
    case "month":
      return format(date, "MMM yyyy");
    default:
      unreachable(granularity);
  }

  return "N/A";
};

const getLinearColor = (uptime: number) => {
  const LOWER_BOUND = 75;
  const UPPER_BOUND = 100;

  const clampedUptime = Math.max(LOWER_BOUND, Math.min(UPPER_BOUND, uptime));

  const percentage =
    (clampedUptime - LOWER_BOUND) / (UPPER_BOUND - LOWER_BOUND);

  // 0 - 120 (from red to green)
  const hue = Math.round(percentage * 120);

  return `hsl(${hue}, 85%, 45%)`;
};

const uptimeConfig = {
  uptime: {
    label: "Uptime (%)",
    color: "var(--color-green-500)",
  },
  success: {
    label: "Success",
    color: "var(--color-green-500)",
  },
  error: {
    label: "Errors",
    color: "var(--color-red-500)",
  },
} satisfies ChartConfig;

export const MetricsGraph = ({ metrics }: { metrics: StatusMetrics }) => {
  const extendedMetrics: ExtendedStatusMetricsEntry[] = useMemo(() => {
    return metrics.data.map((entry) => ({
      ...entry,
      uptime: entry.total === 0 ? 100 : (entry.success / entry.total) * 100,
      error: entry.total - entry.success,
    }));
  }, [metrics.data]);

  return (
    <div>
      <Tabs defaultValue="uptime">
        <TabsList>
          <TabsTrigger value="uptime">Uptime</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
        </TabsList>

        <Card className="mt-2">
          <CardContent>
            <TabsContent value="uptime">
              <UptimePlot
                extendedMetrics={extendedMetrics}
                granularity={metrics.granularity}
              />
            </TabsContent>
            <TabsContent value="volume">
              <VolumePlot
                extendedMetrics={extendedMetrics}
                granularity={metrics.granularity}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

const UptimePlot = ({
  extendedMetrics,
  granularity,
}: {
  extendedMetrics: ExtendedStatusMetricsEntry[];
  granularity: Granularity;
}) => {
  return (
    <ChartContainer config={uptimeConfig} className="max-h-120 w-full">
      <BarChart accessibilityLayer data={extendedMetrics}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="timestamp"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => formatDate(value as string, granularity)}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-PL", {
                  second: "numeric",
                  minute: "numeric",
                  hour: "numeric",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
          }
        />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} unit="%" />
        <Bar
          dataKey="uptime"
          fill="var(--color-green-500)"
          radius={[4, 4, 0, 0]}
        >
          {" "}
          {extendedMetrics.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getLinearColor(entry.uptime)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

const VolumePlot = ({
  extendedMetrics,
  granularity,
}: {
  extendedMetrics: ExtendedStatusMetricsEntry[];
  granularity: Granularity;
}) => {
  return (
    <ChartContainer config={uptimeConfig} className="max-h-120 w-full">
      <BarChart accessibilityLayer data={extendedMetrics}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="timestamp"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => formatDate(value as string, granularity)}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-PL", {
                  second: "numeric",
                  minute: "numeric",
                  hour: "numeric",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
          }
        />
        <Bar
          dataKey="success"
          stackId="a"
          fill="var(--color-green-500)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="error"
          stackId="a"
          fill="var(--color-red-500)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
