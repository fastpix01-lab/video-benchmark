"use client";

import type { BenchmarkRun } from "@/lib/providers/types";
import { downloadJson } from "@/lib/export";

interface JsonExportButtonProps {
  runs: BenchmarkRun[];
}

export default function JsonExportButton({ runs }: JsonExportButtonProps) {
  return (
    <button
      onClick={() => downloadJson(runs)}
      className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2
        text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100
        dark:hover:bg-zinc-800 transition-colors"
    >
      Export JSON
    </button>
  );
}
