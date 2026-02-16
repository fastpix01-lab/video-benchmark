"use client";

import { useEffect, useState } from "react";
import type { Progress } from "@/hooks/useBenchmark";

const STEPS = [
  { key: "uploading", label: "Upload" },
  { key: "processing", label: "Processing" },
  { key: "measuring", label: "Measuring" },
] as const;

interface ProgressIndicatorProps {
  progress: Progress;
}

export default function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [progress.providerSlug, progress.step]);

  const currentIndex = STEPS.findIndex((s) => s.key === progress.step);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {progress.providerName}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {progress.fileName} &middot; {progress.detail}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
          {elapsed}s
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {STEPS.map((step, i) => {
          const isActive = i === currentIndex;
          const isDone = i < currentIndex;

          return (
            <div key={step.key} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-full h-1.5 rounded-full transition-colors ${
                    isDone
                      ? "bg-green-500"
                      : isActive
                      ? "bg-blue-500 animate-pulse"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
                <span
                  className={`mt-1.5 text-xs font-medium ${
                    isDone
                      ? "text-green-600 dark:text-green-400"
                      : isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
