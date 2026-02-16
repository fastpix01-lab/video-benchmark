"use client";

import { useState } from "react";
import { useBenchmark } from "@/hooks/useBenchmark";
import { PROVIDERS } from "@/lib/constants";
import { downloadCsv } from "@/lib/export";
import ResultsTable from "@/app/components/ResultsTable";
import ProgressIndicator from "@/app/components/ProgressIndicator";
import ShareButton from "@/app/components/ShareButton";
import JsonExportButton from "@/app/components/JsonExportButton";
import AdvancedTogglePanel from "@/app/components/AdvancedTogglePanel";
import ProviderVideoPlayer from "@/app/components/ProviderVideoPlayer";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";

export default function BenchmarkPage() {
  const {
    files,
    setFiles,
    enabled,
    toggleProvider,
    running,
    progress,
    runs,
    error,
    hasResults,
    allResults,
    aggregated,
    videoRef,
    runBenchmark,
    reset,
    advancedEnabled,
    setAdvancedEnabled,
    networkPreset,
    setNetworkPreset,
  } = useBenchmark();

  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Benchmark Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Upload a video file and compare provider performance side by side.
          </p>
        </div>

        {/* ── Two-Column Layout ─────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Left Column: Config + Results ──────────────── */}
          <div className="flex-1 min-w-0">

            {/* Upload & Config */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Select video file(s)
              </label>

              {/* Drag and drop area */}
              <div
                className={`relative rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ease-out
                  ${isDragOver
                    ? "border-2 border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 scale-[1.01] shadow-inner"
                    : files.length > 0
                      ? "border-2 border-solid border-blue-500/40 bg-blue-50/40 dark:bg-blue-950/10"
                      : "border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files.length > 0) {
                    setFiles(Array.from(e.dataTransfer.files));
                  }
                }}
              >
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  disabled={running}
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className={`transition-transform duration-200 ${isDragOver ? "scale-110" : ""}`}>
                  <svg className={`mx-auto w-10 h-10 mb-3 transition-colors duration-200 ${isDragOver ? "text-blue-500" : "text-zinc-400 dark:text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {files.length > 0 ? (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {files.length} file(s): {files.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join(", ")}
                    </span>
                  ) : isDragOver ? (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Drop files here</span>
                  ) : (
                    <span>
                      Drag and drop video files here, or <span className="text-blue-600 dark:text-blue-400 font-medium">browse</span>
                    </span>
                  )}
                </p>
              </div>

              {/* Provider selection */}
              <div className="mt-6">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  Providers
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => toggleProvider(p.slug)}
                      disabled={running}
                      className={`group relative rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none ${
                        enabled.has(p.slug)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-950/60 hover:shadow-md hover:shadow-blue-500/15 active:scale-[0.97]"
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-blue-300 dark:hover:border-blue-600 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 active:scale-[0.97]"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        {enabled.has(p.slug) && (
                          <svg className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Metrics Toggle */}
              <AdvancedTogglePanel
                enabled={advancedEnabled}
                onToggle={setAdvancedEnabled}
                networkPreset={networkPreset}
                onPresetChange={setNetworkPreset}
                disabled={running}
              />

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={runBenchmark}
                  disabled={running || files.length === 0 || enabled.size === 0}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm
                    hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/25 active:bg-blue-700 active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-blue-600
                    transition-all duration-150 ease-out"
                >
                  {running ? "Running..." : "Upload & Benchmark"}
                </button>
                {running && (
                  <button
                    onClick={reset}
                    className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5
                      text-sm font-medium text-zinc-600 dark:text-zinc-400
                      hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400
                      active:scale-[0.98] transition-all duration-150 ease-out"
                  >
                    Cancel
                  </button>
                )}
                {hasResults && !running && (
                  <>
                    <button
                      onClick={() => downloadCsv(runs)}
                      className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5
                        text-sm font-medium text-zinc-600 dark:text-zinc-400
                        hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-200
                        active:scale-[0.98] transition-all duration-150 ease-out"
                    >
                      Export CSV
                    </button>
                    <JsonExportButton runs={runs} />
                    <ShareButton runs={runs} />
                  </>
                )}
              </div>

              {error && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>

            {/* Progress */}
            {progress && <div className="mb-6"><ProgressIndicator progress={progress} /></div>}

            {/* Per-File Results Tables */}
            {runs.map((run, ri) => (
              <div
                key={ri}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50"
              >
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {run.fileName}{" "}
                    <span className="font-normal text-zinc-500">
                      ({(run.fileSize / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </h2>
                </div>
                <ResultsTable results={run.results} />
              </div>
            ))}

            {/* Aggregated Table */}
            {runs.length > 1 && aggregated.length > 0 && (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
                <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Aggregated Averages
                  </h2>
                </div>
                <ResultsTable results={aggregated} />
              </div>
            )}

            {!hasResults && !running && (
              <p className="text-center text-sm text-zinc-400 dark:text-zinc-600 mt-12">
                Select video file(s), choose providers, and click &quot;Upload &amp; Benchmark&quot; to get started.
              </p>
            )}
          </div>

          {/* ── Right Column: Video Player (sticky) ────────── */}
          <div className="w-full lg:w-[380px] lg:shrink-0">
            <div className="lg:sticky lg:top-6">
              <ProviderVideoPlayer
                enabledProviders={enabled}
                allResults={allResults}
                progress={progress}
                running={running}
              />
            </div>
          </div>

        </div>

        {/* ── Full-Width: Performance Dashboard ──────────────── */}
        {hasResults && !running && (
          <div className="mt-6">
            <PerformanceDashboard results={aggregated} />
          </div>
        )}

        {/* Hidden video element for benchmark measurements */}
        <video
          ref={videoRef}
          muted
          playsInline
          className="fixed opacity-0 pointer-events-none w-0 h-0"
        />
      </div>
    </div>
  );
}
