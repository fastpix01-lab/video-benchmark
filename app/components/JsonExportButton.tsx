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
      className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5
        text-sm font-medium text-zinc-600 dark:text-zinc-400
        hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-200
        active:scale-[0.98] transition-all duration-150 ease-out"
    >
      Export JSON
    </button>
  );
}
