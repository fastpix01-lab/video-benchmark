"use client";

import type { AdvancedMetrics } from "@/lib/providers/types";

interface AdvancedResultsCardProps {
  metrics: AdvancedMetrics;
  providerName: string;
}

function SmoothnessBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-500"
      : score >= 50
        ? "bg-yellow-500"
        : "bg-red-500";
  const textColor =
    score >= 80
      ? "text-green-600 dark:text-green-400"
      : score >= 50
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Smoothness
        </span>
        <span className={`text-sm font-semibold ${textColor}`}>
          {score}/100
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
        {value}
      </p>
    </div>
  );
}

export default function AdvancedResultsCard({
  metrics,
  providerName,
}: AdvancedResultsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {providerName}
        </h3>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded px-2 py-0.5">
          {metrics.networkPreset.toUpperCase()} ({metrics.maxBandwidthKbps}{" "}
          Kbps)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Metric
          label="Throttled TTFF"
          value={`${(metrics.throttledStartupMs / 1000).toFixed(2)}s`}
        />
        <Metric label="Rebuffer Count" value={String(metrics.rebufferCount)} />
        <Metric
          label="Rebuffer Duration"
          value={`${(metrics.rebufferDurationMs / 1000).toFixed(2)}s`}
        />
        <Metric
          label="Rebuffer Ratio"
          value={`${(metrics.rebufferRatio * 100).toFixed(1)}%`}
        />
        <Metric
          label="Avg Bitrate"
          value={`${metrics.averageBitrateKbps} Kbps`}
        />
        <Metric
          label="Peak Bitrate"
          value={`${metrics.peakBitrateKbps} Kbps`}
        />
        <Metric
          label="Level Switches"
          value={String(metrics.levelSwitchCount)}
        />
        <Metric
          label="Observation"
          value={`${(metrics.playbackDurationMs / 1000).toFixed(0)}s`}
        />
      </div>

      <SmoothnessBar score={metrics.smoothnessScore} />
    </div>
  );
}
