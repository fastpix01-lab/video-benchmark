"use client";

import type { ProviderMetrics } from "@/lib/providers/types";
import RankBadge from "./RankBadge";
import { fmt } from "./ResultsTable";

interface LeaderboardTableProps {
  results: ProviderMetrics[];
}

export default function LeaderboardTable({ results }: LeaderboardTableProps) {
  const successful = results
    .filter((r) => r.status === "success")
    .sort((a, b) => a.totalMs - b.totalMs);

  if (successful.length === 0) return null;

  const maxTotal = Math.max(...successful.map((r) => r.totalMs));

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Leaderboard
        </h3>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {successful.map((r, i) => (
          <div key={r.provider} className="px-4 py-3 flex items-center gap-4">
            <RankBadge rank={i + 1} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {r.providerName}
                </span>
                <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                  {fmt(r.totalMs)}
                </span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === 0
                      ? "bg-gradient-to-r from-amber-400 to-amber-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${(r.totalMs / maxTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
