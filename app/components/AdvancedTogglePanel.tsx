"use client";

import { NETWORK_PRESETS } from "@/lib/constants";

interface AdvancedTogglePanelProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  networkPreset: "3g" | "2g";
  onPresetChange: (preset: "3g" | "2g") => void;
  disabled: boolean;
}

export default function AdvancedTogglePanel({
  enabled,
  onToggle,
  networkPreset,
  onPresetChange,
  disabled,
}: AdvancedTogglePanelProps) {
  return (
    <div className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Advanced Metrics
          </span>
          <div className="relative group">
            <svg
              className="w-4 h-4 text-zinc-400 dark:text-zinc-500 cursor-help"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-zinc-900 dark:bg-zinc-700 text-white text-xs p-3 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-10">
              Measures throttled startup, rebuffering, bitrate quality, and
              smoothness during a 10-second playback observation under simulated
              network conditions.
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-700" />
            </div>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={disabled}
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed
            ${enabled ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-600"}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out
              ${enabled ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {enabled && (
        <div className="mt-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            Network Simulation
          </p>
          <div className="flex gap-2">
            {(Object.entries(NETWORK_PRESETS) as [
              "3g" | "2g",
              (typeof NETWORK_PRESETS)[keyof typeof NETWORK_PRESETS],
            ][]).map(([key, preset]) => (
              <button
                key={key}
                disabled={disabled}
                onClick={() => onPresetChange(key)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none ${
                  networkPreset === key
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                    : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
