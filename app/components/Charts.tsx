"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProviderMetrics } from "@/lib/providers/types";

interface ChartsProps {
  results: ProviderMetrics[];
}

export default function Charts({ results }: ChartsProps) {
  const successful = results.filter((r) => r.status === "success");
  if (successful.length === 0) return null;

  const data = successful.map((r) => ({
    name: r.providerName,
    Upload: +(r.uploadMs / 1000).toFixed(2),
    Processing: +(r.processingMs / 1000).toFixed(2),
    Startup: +(r.startupMs / 1000).toFixed(2),
    Total: +(r.totalMs / 1000).toFixed(2),
  }));

  const fastest = {
    upload: successful.reduce((a, b) => (a.uploadMs < b.uploadMs ? a : b)),
    processing: successful.reduce((a, b) =>
      a.processingMs < b.processingMs ? a : b
    ),
    startup: successful.reduce((a, b) =>
      a.startupMs < b.startupMs ? a : b
    ),
    total: successful.reduce((a, b) => (a.totalMs < b.totalMs ? a : b)),
  };

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Badge label="Fastest Upload" provider={fastest.upload.providerName} />
        <Badge
          label="Fastest Processing"
          provider={fastest.processing.providerName}
        />
        <Badge
          label="Fastest Startup"
          provider={fastest.startup.providerName}
        />
        <Badge label="Overall Winner" provider={fastest.total.providerName} />
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
          Time Comparison (seconds)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: 8,
              }}
            />
            <Legend />
            <Bar dataKey="Upload" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Processing" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Startup" fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total time chart */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
          Total End-to-End Time (seconds)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="Total" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Badge({ label, provider }: { label: string; provider: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-center">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
        {provider}
      </p>
    </div>
  );
}
