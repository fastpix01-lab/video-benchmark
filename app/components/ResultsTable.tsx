"use client";

import type { ProviderMetrics } from "@/lib/providers/types";

export function fmt(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export default function ResultsTable({ results }: { results: ProviderMetrics[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
          <th className="px-4 py-3 text-left font-medium">Platform</th>
          <th className="px-4 py-3 text-right font-medium">Upload</th>
          <th className="px-4 py-3 text-right font-medium">Processing</th>
          <th className="px-4 py-3 text-right font-medium">Startup</th>
          <th className="px-4 py-3 text-right font-medium">Total</th>
          <th className="px-4 py-3 text-right font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr
            key={r.provider}
            className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors duration-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
          >
            <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
              {r.providerName}
            </td>
            {r.status === "success" ? (
              <>
                <td className="px-4 py-3 text-right font-mono">
                  {fmt(r.uploadMs)}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {fmt(r.processingMs)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-green-600 dark:text-green-400">
                  {fmt(r.startupMs)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold">
                  {fmt(r.totalMs)}
                </td>
                <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                  OK
                </td>
              </>
            ) : (
              <>
                <td colSpan={4} className="px-4 py-3 text-right text-red-500 text-xs">
                  {r.error}
                </td>
                <td className="px-4 py-3 text-right text-red-500">Failed</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
