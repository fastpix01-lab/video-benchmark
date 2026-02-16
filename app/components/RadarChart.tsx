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

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#ec4899"];

interface RadarChartProps {
  results: ProviderMetrics[];
}

export default function RadarChart({ results }: RadarChartProps) {
  const successful = results.filter((r) => r.status === "success");
  if (successful.length < 2) return null;

  const maxUpload = Math.max(...successful.map((r) => r.uploadMs));
  const maxProcessing = Math.max(...successful.map((r) => r.processingMs));
  const maxStartup = Math.max(...successful.map((r) => r.startupMs));
  const hasAdvanced = successful.some((r) => r.advanced);

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

  if (hasAdvanced) {
    const withAdvanced = successful.filter((r) => r.advanced);
    const maxBitrate = Math.max(...withAdvanced.map((r) => r.advanced!.averageBitrateKbps));

    data.push(
      {
        metric: "Smoothness",
        ...Object.fromEntries(
          successful.map((r) => [
            r.providerName,
            r.advanced ? r.advanced.smoothnessScore : 0,
          ])
        ),
      },
      {
        metric: "Bitrate Quality",
        ...Object.fromEntries(
          successful.map((r) => [
            r.providerName,
            r.advanced && maxBitrate > 0
              ? Math.round((r.advanced.averageBitrateKbps / maxBitrate) * 100)
              : 0,
          ])
        ),
      },
      {
        metric: "Rebuffer Resilience",
        ...Object.fromEntries(
          successful.map((r) => [
            r.providerName,
            r.advanced
              ? Math.round((1 - r.advanced.rebufferRatio) * 100)
              : 0,
          ])
        ),
      }
    );
  }

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
