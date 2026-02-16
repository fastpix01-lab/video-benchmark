"use client";

import { useBenchmark } from "@/hooks/useBenchmark";
import { PROVIDERS } from "@/lib/constants";
import { downloadCsv } from "@/lib/export";
import Charts from "@/app/components/Charts";
import ResultsTable from "@/app/components/ResultsTable";
import ProgressIndicator from "@/app/components/ProgressIndicator";
import LeaderboardTable from "@/app/components/LeaderboardTable";
import RadarChart from "@/app/components/RadarChart";
import ShareButton from "@/app/components/ShareButton";
import JsonExportButton from "@/app/components/JsonExportButton";

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
    aggregated,
    videoRef,
    runBenchmark,
    reset,
  } = useBenchmark();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Benchmark Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Upload a video file and compare provider performance side by side.
          </p>
        </div>

        {/* Upload & Config */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-6">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Select video file(s)
          </label>

          {/* Drag and drop area */}
          <div
            className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-blue-500"); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove("border-blue-500"); }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-blue-500");
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
            <svg className="mx-auto w-10 h-10 text-zinc-400 dark:text-zinc-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {files.length > 0 ? (
                <span>
                  {files.length} file(s): {files.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join(", ")}
                </span>
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
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => toggleProvider(p.slug)}
                  disabled={running}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all disabled:opacity-50 ${
                    enabled.has(p.slug)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={runBenchmark}
              disabled={running || files.length === 0 || enabled.size === 0}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {running ? "Running..." : "Upload & Benchmark"}
            </button>
            {running && (
              <button
                onClick={reset}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5
                  text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100
                  dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            )}
            {hasResults && !running && (
              <>
                <button
                  onClick={() => downloadCsv(runs)}
                  className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2.5
                    text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100
                    dark:hover:bg-zinc-800 transition-colors"
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

        {/* Leaderboard */}
        {hasResults && !running && aggregated.length > 1 && (
          <div className="mb-6">
            <LeaderboardTable results={aggregated} />
          </div>
        )}

        {/* Results Tables */}
        {runs.map((run, ri) => (
          <div
            key={ri}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-6"
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

        {/* Aggregated */}
        {runs.length > 1 && aggregated.length > 0 && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Aggregated Averages
              </h2>
            </div>
            <ResultsTable results={aggregated} />
          </div>
        )}

        {/* Charts */}
        {hasResults && (
          <div className="space-y-6 mb-6">
            <Charts results={aggregated} />
            <RadarChart results={aggregated} />
          </div>
        )}

        {/* Hidden video element */}
        <video
          ref={videoRef}
          muted
          playsInline
          className="fixed opacity-0 pointer-events-none w-0 h-0"
        />

        {!hasResults && !running && (
          <p className="text-center text-sm text-zinc-400 dark:text-zinc-600 mt-12">
            Select video file(s), choose providers, and click &quot;Upload &amp; Benchmark&quot; to get started.
          </p>
        )}
      </div>
    </div>
  );
}
