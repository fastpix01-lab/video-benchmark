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
      className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2
        text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100
        dark:hover:bg-zinc-800 transition-colors"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
