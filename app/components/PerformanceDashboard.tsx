"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts";
import type { ProviderMetrics } from "@/lib/providers/types";

const PROVIDER_COLORS = [
  "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#ec4899",
];

function getColor(index: number) {
  return PROVIDER_COLORS[index % PROVIDER_COLORS.length];
}

function fmt(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

function smoothnessColor(score: number) {
  if (score >= 80) return { ring: "ring-green-500/30", text: "text-green-500", bg: "bg-green-500" };
  if (score >= 50) return { ring: "ring-yellow-500/30", text: "text-yellow-500", bg: "bg-yellow-500" };
  return { ring: "ring-red-500/30", text: "text-red-500", bg: "bg-red-500" };
}

// ── Custom Tooltip ──────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl px-3 py-2.5">
      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-500 dark:text-zinc-400">{entry.name}</span>
          <span className="ml-auto font-mono font-medium text-zinc-900 dark:text-zinc-100">{entry.value}s</span>
        </div>
      ))}
    </div>
  );
}

// ── Section Tab Button ──────────────────────────────────────────────

type TabId = "overview" | "breakdown" | "advanced" | "radar";

function TabButton({ id, label, active, onClick, badge }: { id: TabId; label: string; active: boolean; onClick: () => void; badge?: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150
        ${active
          ? "text-blue-600 dark:text-blue-400"
          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        }`}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            {badge}
          </span>
        )}
      </span>
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
      )}
    </button>
  );
}

// ── Horizontal Metric Bar ───────────────────────────────────────────

function MetricBar({ label, value, maxValue, isBest, color, formattedValue }: {
  label: string;
  value: number;
  maxValue: number;
  isBest: boolean;
  color: string;
  formattedValue: string;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="group flex items-center gap-3 py-1.5">
      <span className="w-20 text-xs text-zinc-500 dark:text-zinc-400 truncate shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
        />
        {isBest && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 dark:text-green-400">
            FASTEST
          </span>
        )}
      </div>
      <span className="w-16 text-right text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
        {formattedValue}
      </span>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────

interface PerformanceDashboardProps {
  results: ProviderMetrics[];
}

export default function PerformanceDashboard({ results }: PerformanceDashboardProps) {
  const successful = results.filter((r) => r.status === "success");
  const hasAdvanced = successful.some((r) => r.advanced);
  const defaultTab: TabId = hasAdvanced ? "advanced" : "overview";
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  if (successful.length === 0) return null;

  // Sort by total time for rankings
  const ranked = [...successful].sort((a, b) => a.totalMs - b.totalMs);
  const colorMap = new Map(successful.map((r, i) => [r.provider, getColor(i)]));

  // Best values
  const best = {
    upload: Math.min(...successful.map((r) => r.uploadMs)),
    processing: Math.min(...successful.map((r) => r.processingMs)),
    startup: Math.min(...successful.map((r) => r.startupMs)),
    total: Math.min(...successful.map((r) => r.totalMs)),
  };
  const max = {
    upload: Math.max(...successful.map((r) => r.uploadMs)),
    processing: Math.max(...successful.map((r) => r.processingMs)),
    startup: Math.max(...successful.map((r) => r.startupMs)),
    total: Math.max(...successful.map((r) => r.totalMs)),
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 px-2 overflow-x-auto">
        <div className="flex -mb-px">
          <TabButton id="overview" label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          {hasAdvanced && (
            <TabButton id="advanced" label="Quality (Advanced Metrics)" active={activeTab === "advanced"} onClick={() => setActiveTab("advanced")} />
          )}
          <TabButton id="breakdown" label="Breakdown" active={activeTab === "breakdown"} onClick={() => setActiveTab("breakdown")} />
          {successful.length >= 2 && (
            <TabButton id="radar" label="Radar" active={activeTab === "radar"} onClick={() => setActiveTab("radar")} />
          )}
        </div>
      </div>

      <div className="p-5">
        {activeTab === "overview" && (
          <OverviewTab ranked={ranked} successful={successful} best={best} max={max} colorMap={colorMap} />
        )}
        {activeTab === "breakdown" && (
          <BreakdownTab successful={successful} colorMap={colorMap} />
        )}
        {activeTab === "advanced" && hasAdvanced && (
          <AdvancedTab successful={successful} colorMap={colorMap} />
        )}
        {activeTab === "radar" && (
          <RadarTab successful={successful} colorMap={colorMap} hasAdvanced={hasAdvanced} />
        )}
      </div>
    </div>
  );
}

// ── Overview Tab ────────────────────────────────────────────────────

function OverviewTab({ ranked, successful, best, max, colorMap }: {
  ranked: ProviderMetrics[];
  successful: ProviderMetrics[];
  best: { upload: number; processing: number; startup: number; total: number };
  max: { upload: number; processing: number; startup: number; total: number };
  colorMap: Map<string, string>;
}) {
  const winner = ranked[0];

  return (
    <div className="space-y-6">
      {/* Winner Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/40 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.59l-5.072 4.614L16.18 20 10 16.42 3.82 20l1.252-6.796L0 8.59l7.072-.734L10 1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-amber-700/70 dark:text-amber-400/70">Overall Winner</p>
            <p className="text-lg font-bold text-amber-900 dark:text-amber-200">{winner.providerName}</p>
          </div>
          <span className="ml-auto text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">
            {fmt(winner.totalMs)}
          </span>
        </div>
      </div>

      {/* Rankings */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
          Rankings by Total Time
        </h4>
        <div className="space-y-2">
          {ranked.map((r, i) => (
            <div key={r.provider} className="flex items-center gap-3 group">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i === 0
                  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  : i === 1
                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                    : i === 2
                      ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              }`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.providerName}</span>
                  <span className="text-sm font-mono font-medium text-zinc-600 dark:text-zinc-400">{fmt(r.totalMs)}</span>
                </div>
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(r.totalMs / max.total) * 100}%`,
                      backgroundColor: colorMap.get(r.provider),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Winners */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Upload", bestMs: best.upload, finder: (r: ProviderMetrics) => r.uploadMs },
          { label: "Processing", bestMs: best.processing, finder: (r: ProviderMetrics) => r.processingMs },
          { label: "Startup", bestMs: best.startup, finder: (r: ProviderMetrics) => r.startupMs },
          { label: "Total", bestMs: best.total, finder: (r: ProviderMetrics) => r.totalMs },
        ].map(({ label, bestMs, finder }) => {
          const winner = successful.find((r) => finder(r) === bestMs)!;
          return (
            <div key={label} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 text-center hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                Fastest {label}
              </p>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{winner.providerName}</p>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">{fmt(bestMs)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Breakdown Tab ───────────────────────────────────────────────────

function BreakdownTab({ successful, colorMap }: {
  successful: ProviderMetrics[];
  colorMap: Map<string, string>;
}) {
  const chartData = successful.map((r) => ({
    name: r.providerName,
    Upload: +(r.uploadMs / 1000).toFixed(2),
    Processing: +(r.processingMs / 1000).toFixed(2),
    Startup: +(r.startupMs / 1000).toFixed(2),
  }));

  const totalData = [...successful]
    .sort((a, b) => a.totalMs - b.totalMs)
    .map((r) => ({
      name: r.providerName,
      Total: +(r.totalMs / 1000).toFixed(2),
      provider: r.provider,
    }));

  const maxUpload = Math.max(...successful.map((r) => r.uploadMs));
  const maxProc = Math.max(...successful.map((r) => r.processingMs));
  const maxStartup = Math.max(...successful.map((r) => r.startupMs));
  const bestUpload = Math.min(...successful.map((r) => r.uploadMs));
  const bestProc = Math.min(...successful.map((r) => r.processingMs));
  const bestStartup = Math.min(...successful.map((r) => r.startupMs));

  return (
    <div className="space-y-6">
      {/* Stacked Bar Chart */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
          Time Breakdown
        </h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} unit="s" />
            <RechartsTooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Upload" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Processing" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Startup" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Time Horizontal Bars */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
          Total End-to-End
        </h4>
        <ResponsiveContainer width="100%" height={successful.length * 44 + 20}>
          <BarChart data={totalData} layout="vertical" barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.5} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} unit="s" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} width={85} />
            <RechartsTooltip content={<ChartTooltip />} />
            <Bar dataKey="Total" radius={[0, 6, 6, 0]}>
              {totalData.map((entry) => (
                <Cell key={entry.provider} fill={colorMap.get(entry.provider) || "#3b82f6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Metric Bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { title: "Upload", data: successful, getter: (r: ProviderMetrics) => r.uploadMs, maxVal: maxUpload, bestVal: bestUpload },
          { title: "Processing", data: successful, getter: (r: ProviderMetrics) => r.processingMs, maxVal: maxProc, bestVal: bestProc },
          { title: "Startup", data: successful, getter: (r: ProviderMetrics) => r.startupMs, maxVal: maxStartup, bestVal: bestStartup },
        ].map(({ title, data, getter, maxVal, bestVal }) => (
          <div key={title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
              {title}
            </h4>
            <div>
              {data.map((r) => (
                <MetricBar
                  key={r.provider}
                  label={r.providerName}
                  value={getter(r)}
                  maxValue={maxVal}
                  isBest={getter(r) === bestVal}
                  color={colorMap.get(r.provider) || "#3b82f6"}
                  formattedValue={fmt(getter(r))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Advanced Tab ────────────────────────────────────────────────────

function AdvancedTab({ successful, colorMap }: {
  successful: ProviderMetrics[];
  colorMap: Map<string, string>;
}) {
  const withAdvanced = successful.filter((r) => r.advanced);
  if (withAdvanced.length === 0) return null;

  const throttledData = withAdvanced.map((r) => ({
    name: r.providerName,
    "Normal": +(r.startupMs / 1000).toFixed(2),
    "Throttled": +(r.advanced!.throttledStartupMs / 1000).toFixed(2),
    provider: r.provider,
  }));

  const bestSmoothness = Math.max(...withAdvanced.map((r) => r.advanced!.smoothnessScore));
  const bestBitrate = Math.max(...withAdvanced.map((r) => r.advanced!.averageBitrateKbps));

  return (
    <div className="space-y-6">
      {/* Smoothness Scores */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
          Playback Smoothness
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {withAdvanced
            .sort((a, b) => b.advanced!.smoothnessScore - a.advanced!.smoothnessScore)
            .map((r) => {
              const score = r.advanced!.smoothnessScore;
              const sc = smoothnessColor(score);
              const isBest = score === bestSmoothness;
              return (
                <div key={r.provider} className={`relative rounded-xl border p-4 text-center transition-all duration-200 hover:scale-[1.02] ${
                  isBest
                    ? "border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}>
                  {isBest && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded-full">
                      BEST
                    </span>
                  )}
                  <div className={`mx-auto w-14 h-14 rounded-full ring-4 ${sc.ring} flex items-center justify-center mb-2`}>
                    <span className={`text-lg font-bold ${sc.text}`}>{score}</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.providerName}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.bg}`} />
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {r.advanced!.rebufferCount} rebuffers
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Throttled vs Normal Chart */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
          Startup: Normal vs Throttled ({withAdvanced[0].advanced!.networkPreset.toUpperCase()})
        </h4>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={throttledData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} unit="s" />
            <RechartsTooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Normal" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Throttled" fill="#f97316" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bitrate + Detailed Stats Grid */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
          Detailed Quality Metrics
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-2 pr-4 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400">Provider</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">Throttled TTFF</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">Rebuffers</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">Rebuf. Time</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">Avg Bitrate</th>
                <th className="py-2 px-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">Peak Bitrate</th>
                <th className="py-2 pl-3 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">Level Switches</th>
              </tr>
            </thead>
            <tbody>
              {withAdvanced.map((r) => {
                const a = r.advanced!;
                return (
                  <tr key={r.provider} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colorMap.get(r.provider) }} />
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{r.providerName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-700 dark:text-zinc-300">{fmt(a.throttledStartupMs)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-700 dark:text-zinc-300">{a.rebufferCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-700 dark:text-zinc-300">{fmt(a.rebufferDurationMs)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={a.averageBitrateKbps === bestBitrate ? "text-green-600 dark:text-green-400 font-semibold" : "text-zinc-700 dark:text-zinc-300"}>
                        {a.averageBitrateKbps} Kbps
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-700 dark:text-zinc-300">{a.peakBitrateKbps} Kbps</td>
                    <td className="py-2.5 pl-3 text-right font-mono text-zinc-700 dark:text-zinc-300">{a.levelSwitchCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Radar Tab ───────────────────────────────────────────────────────

function RadarTab({ successful, colorMap, hasAdvanced }: {
  successful: ProviderMetrics[];
  colorMap: Map<string, string>;
  hasAdvanced: boolean;
}) {
  if (successful.length < 2) return null;

  const maxUpload = Math.max(...successful.map((r) => r.uploadMs));
  const maxProcessing = Math.max(...successful.map((r) => r.processingMs));
  const maxStartup = Math.max(...successful.map((r) => r.startupMs));

  const data = [
    {
      metric: "Upload Speed",
      ...Object.fromEntries(
        successful.map((r) => [r.providerName, Math.round((1 - r.uploadMs / maxUpload) * 100)])
      ),
    },
    {
      metric: "Processing Speed",
      ...Object.fromEntries(
        successful.map((r) => [r.providerName, Math.round((1 - r.processingMs / maxProcessing) * 100)])
      ),
    },
    {
      metric: "Startup Latency",
      ...Object.fromEntries(
        successful.map((r) => [r.providerName, Math.round((1 - r.startupMs / maxStartup) * 100)])
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
          successful.map((r) => [r.providerName, r.advanced ? r.advanced.smoothnessScore : 0])
        ),
      },
      {
        metric: "Bitrate Quality",
        ...Object.fromEntries(
          successful.map((r) => [
            r.providerName,
            r.advanced && maxBitrate > 0 ? Math.round((r.advanced.averageBitrateKbps / maxBitrate) * 100) : 0,
          ])
        ),
      },
      {
        metric: "Rebuf. Resilience",
        ...Object.fromEntries(
          successful.map((r) => [r.providerName, r.advanced ? Math.round((1 - r.advanced.rebufferRatio) * 100) : 0])
        ),
      }
    );
  }

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
        Relative Performance (higher is better)
      </h4>
      <ResponsiveContainer width="100%" height={380}>
        <RadarChart data={data}>
          <PolarGrid stroke="#3f3f46" strokeOpacity={0.5} />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#a1a1aa" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#52525b" }} />
          {successful.map((r) => (
            <Radar
              key={r.provider}
              name={r.providerName}
              dataKey={r.providerName}
              stroke={colorMap.get(r.provider) || "#3b82f6"}
              fill={colorMap.get(r.provider) || "#3b82f6"}
              fillOpacity={0.12}
              strokeWidth={2}
            />
          ))}
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
