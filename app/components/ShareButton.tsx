"use client";

import { useState } from "react";
import type { BenchmarkRun } from "@/lib/providers/types";
import { encodeResults } from "@/lib/share";

interface ShareButtonProps {
  runs: BenchmarkRun[];
}

export default function ShareButton({ runs }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const encoded = encodeResults(runs);
    const url = `${window.location.origin}/benchmark?results=${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5
        text-sm font-medium text-zinc-600 dark:text-zinc-400
        hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-200
        active:scale-[0.98] transition-all duration-150 ease-out"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
