"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ProviderMetrics } from "@/lib/providers/types";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];

interface RadarChartProps {
  results: ProviderMetrics[];
}

export default function RadarChart({ results }: RadarChartProps) {
  const successful = results.filter((r) => r.status === "success");
  if (successful.length < 2) return null;

  const maxUpload = Math.max(...successful.map((r) => r.uploadMs));
  const maxProcessing = Math.max(...successful.map((r) => r.processingMs));
  const maxStartup = Math.max(...successful.map((r) => r.startupMs));

  const data = [
    {
      metric: "Upload Speed",
      ...Object.fromEntries(
        successful.map((r) => [r.providerName, +((1 - r.uploadMs / maxUpload) * 100).toFixed(0)])
      ),
    },
    {
      metric: "Processing Speed",
      ...Object.fromEntries(
        successful.map((r) => [r.providerName, +((1 - r.processingMs / maxProcessing) * 100).toFixed(0)])
      ),
    },
    {
      metric: "Startup Latency",
      ...Object.fromEntries(
        successful.map((r) => [r.providerName, +((1 - r.startupMs / maxStartup) * 100).toFixed(0)])
      ),
    },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
        Relative Performance (higher is better)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "#a1a1aa" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#71717a" }} />
          {successful.map((r, i) => (
            <Radar
              key={r.provider}
              name={r.providerName}
              dataKey={r.providerName}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.15}
            />
          ))}
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
