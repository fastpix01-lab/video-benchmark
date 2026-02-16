"use client";

import { useState, useRef, useCallback } from "react";
import Hls from "hls.js";
import { Uploader } from "@fastpix/resumable-uploads";
import Charts from "./components/Charts";
import type {
  ProviderMetrics,
  BenchmarkRun,
  CreateUploadResult,
  StatusResult,
} from "@/lib/providers/types";

const PROVIDERS = [
  { slug: "mux", name: "Mux", proxy: false },
  { slug: "fastpix", name: "FastPix", proxy: false },
  { slug: "apivideo", name: "api.video", proxy: true },
  { slug: "cloudinary", name: "Cloudinary", proxy: false },
  { slug: "gumlet", name: "Gumlet", proxy: true },
] as const;

const MAX_RETRIES = 2;
const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 5 * 60 * 1000; // 5 min

type Step = "uploading" | "processing" | "measuring";

interface Progress {
  fileIndex: number;
  fileName: string;
  providerSlug: string;
  providerName: string;
  step: Step;
  detail: string;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(PROVIDERS.map((p) => p.slug))
  );
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setRunning(false);
    setProgress(null);
  }, []);

  function toggleProvider(slug: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  // ── Benchmark Runner ──────────────────────────────────────────────

  async function runBenchmark() {
    if (files.length === 0 || enabled.size === 0) return;
    abortRef.current = false;
    setRunning(true);
    setError(null);
    setRuns([]);

    const allRuns: BenchmarkRun[] = [];

    for (let fi = 0; fi < files.length; fi++) {
      const file = files[fi];
      const results: ProviderMetrics[] = [];

      for (const p of PROVIDERS) {
        if (!enabled.has(p.slug)) continue;
        if (abortRef.current) break;

        const result = await benchmarkProvider(file, fi, p.slug, p.name);
        results.push(result);
        // Update runs incrementally so user sees results as they come
        const currentRun = { fileName: file.name, fileSize: file.size, results: [...results] };
        setRuns([...allRuns, currentRun]);
      }

      allRuns.push({ fileName: file.name, fileSize: file.size, results });
      setRuns([...allRuns]);
    }

    setRunning(false);
    setProgress(null);
  }

  async function benchmarkProvider(
    file: File,
    fileIndex: number,
    slug: string,
    name: string
  ): Promise<ProviderMetrics> {
    const fail = (err: string): ProviderMetrics => ({
      provider: slug,
      providerName: name,
      uploadMs: 0,
      processingMs: 0,
      startupMs: 0,
      totalMs: 0,
      playbackUrl: "",
      status: "failed",
      error: err,
    });

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const totalStart = performance.now();

        // Upload
        const providerConfig = PROVIDERS.find((p) => p.slug === slug)!;
        setProgress({
          fileIndex,
          fileName: file.name,
          providerSlug: slug,
          providerName: name,
          step: "uploading",
          detail: attempt > 0 ? `Retry ${attempt}/${MAX_RETRIES}` : `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        });

        let trackingId: string;
        const uploadStart = performance.now();

        if (providerConfig.proxy) {
          // Proxy upload: send file to our backend which creates the upload
          // and forwards the file to the provider (avoids CORS issues)
          const form = new FormData();
          form.append("file", file);
          const proxyRes = await fetch(`/api/providers/${slug}/proxy-upload`, {
            method: "POST",
            body: form,
          });
          if (!proxyRes.ok) {
            const body = await proxyRes.json().catch(() => ({}));
            throw new Error(body.error || `Proxy upload failed (${proxyRes.status})`);
          }
          const proxyData = await proxyRes.json();
          trackingId = proxyData.trackingId;
        } else {
          // Direct upload: get signed URL, then upload file directly to provider
          const createRes = await fetch(`/api/providers/${slug}/upload`, {
            method: "POST",
          });
          if (!createRes.ok) {
            const body = await createRes.json().catch(() => ({}));
            throw new Error(body.error || `Upload init failed (${createRes.status})`);
          }
          const uploadInfo: CreateUploadResult = await createRes.json();
          trackingId = uploadInfo.trackingId;
          await performUpload(uploadInfo, file);
        }

        const uploadMs = Math.round(performance.now() - uploadStart);

        if (abortRef.current) return fail("Cancelled");

        // Processing
        setProgress({
          fileIndex,
          fileName: file.name,
          providerSlug: slug,
          providerName: name,
          step: "processing",
          detail: "Waiting for readiness...",
        });

        const processStart = performance.now();
        const status = await pollUntilReady(slug, trackingId, (detail) => {
          setProgress({
            fileIndex,
            fileName: file.name,
            providerSlug: slug,
            providerName: name,
            step: "processing",
            detail,
          });
        });
        const processingMs = Math.round(performance.now() - processStart);

        if (!status.playbackUrl) throw new Error("No playback URL returned");
        if (abortRef.current) return fail("Cancelled");

        // Startup time
        setProgress({
          fileIndex,
          fileName: file.name,
          providerSlug: slug,
          providerName: name,
          step: "measuring",
          detail: "Measuring first-frame latency...",
        });

        const video = videoRef.current;
        if (!video) throw new Error("Video element missing");
        const startupMs = await measureStartupTime(video, status.playbackUrl);

        const totalMs = Math.round(performance.now() - totalStart);

        return {
          provider: slug,
          providerName: name,
          uploadMs,
          processingMs,
          startupMs,
          totalMs,
          playbackUrl: status.playbackUrl,
          status: "success",
        };
      } catch (err) {
        if (attempt === MAX_RETRIES) {
          return fail(err instanceof Error ? err.message : "Unknown error");
        }
      }
    }

    return fail("Max retries exceeded");
  }

  // ── Upload ────────────────────────────────────────────────────────

  async function performUpload(info: CreateUploadResult, file: File) {
    const { upload } = info;

    // FastPix: use the resumable uploads SDK
    if (upload.sdkUpload) {
      return new Promise<void>((resolve, reject) => {
        try {
          const uploader = Uploader.init({
            endpoint: upload.url,
            file,
            chunkSize: 16 * 1024, // 16 MB chunks
          });

          uploader.on("success", () => resolve());
          uploader.on("error", (event) => {
            reject(new Error(`FastPix SDK upload error: ${event.detail.message || "unknown"}`));
          });
        } catch (err) {
          reject(new Error(`FastPix SDK init failed: ${err instanceof Error ? err.message : "unknown"}`));
        }
      });
    }

    if (upload.bodyType === "raw") {
      const headers: Record<string, string> = {
        "Content-Type": file.type || "video/mp4",
      };
      if (upload.headers) {
        Object.assign(headers, upload.headers);
      }
      const res = await fetch(upload.url, {
        method: upload.method,
        body: file,
        headers,
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}): ${errBody}`);
      }
    } else {
      const form = new FormData();
      form.append(upload.formField || "file", file);
      if (upload.extraFormFields) {
        for (const [k, v] of Object.entries(upload.extraFormFields)) {
          form.append(k, v);
        }
      }
      // Don't set Content-Type for FormData — browser sets multipart boundary
      const headers: Record<string, string> = {};
      if (upload.headers) {
        for (const [k, v] of Object.entries(upload.headers)) {
          if (k.toLowerCase() !== "content-type") headers[k] = v;
        }
      }
      const res = await fetch(upload.url, {
        method: upload.method,
        body: form,
        headers,
      });
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}): ${errBody}`);
      }
    }
  }

  // ── Polling ───────────────────────────────────────────────────────

  async function pollUntilReady(
    slug: string,
    trackingId: string,
    onUpdate: (detail: string) => void
  ): Promise<StatusResult> {
    const deadline = Date.now() + POLL_TIMEOUT;
    let poll = 0;

    while (Date.now() < deadline) {
      if (abortRef.current) throw new Error("Cancelled");
      poll++;

      const res = await fetch(`/api/providers/${slug}/status/${trackingId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Status poll failed (${res.status})`);
      }
      const data: StatusResult = await res.json();

      if (data.ready) return data;
      if (data.failed) throw new Error(data.error || "Processing failed");

      onUpdate(`Poll ${poll}...`);
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }

    throw new Error("Timed out waiting for readiness");
  }

  // ── Startup Measurement ───────────────────────────────────────────

  async function measureStartupTime(
    video: HTMLVideoElement,
    playbackUrl: string
  ): Promise<number> {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();
    video.muted = true;
    video.playsInline = true;

    return new Promise<number>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Startup timed out (30s)")),
        30000
      );

      function cleanup() {
        clearTimeout(timeout);
      }

      function onPlaying(start: number) {
        return () => {
          cleanup();
          resolve(Math.round(performance.now() - start));
        };
      }

      function onError() {
        cleanup();
        reject(
          new Error(
            `Video error: ${video.error?.message || "unknown"}`
          )
        );
      }

      function startPlayback() {
        video.addEventListener("error", onError, { once: true });
        const start = performance.now();
        video.addEventListener("playing", onPlaying(start), { once: true });
        video.play().catch((e) => {
          cleanup();
          reject(e);
        });
      }

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.on(Hls.Events.ERROR, (_e, d) => {
          if (d.fatal) {
            cleanup();
            reject(new Error(`HLS error: ${d.details}`));
          }
        });
        hls.loadSource(playbackUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, startPlayback);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playbackUrl;
        video.addEventListener("loadedmetadata", startPlayback, {
          once: true,
        });
        video.addEventListener("error", onError, { once: true });
      } else {
        cleanup();
        reject(new Error("HLS not supported"));
      }
    });
  }

  // ── CSV Export ────────────────────────────────────────────────────

  function downloadCsv() {
    const rows = [
      ["File", "Provider", "Upload (ms)", "Processing (ms)", "Startup (ms)", "Total (ms)", "Status", "Error"],
    ];
    for (const run of runs) {
      for (const r of run.results) {
        rows.push([
          run.fileName,
          r.providerName,
          String(r.uploadMs),
          String(r.processingMs),
          String(r.startupMs),
          String(r.totalMs),
          r.status,
          r.error || "",
        ]);
      }
    }
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `benchmark-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Aggregated results ────────────────────────────────────────────

  function aggregateResults(): ProviderMetrics[] {
    const byProvider = new Map<string, ProviderMetrics[]>();
    for (const run of runs) {
      for (const r of run.results) {
        if (r.status !== "success") continue;
        if (!byProvider.has(r.provider)) byProvider.set(r.provider, []);
        byProvider.get(r.provider)!.push(r);
      }
    }

    return Array.from(byProvider.entries()).map(([, results]) => {
      const n = results.length;
      return {
        provider: results[0].provider,
        providerName: results[0].providerName,
        uploadMs: Math.round(results.reduce((s, r) => s + r.uploadMs, 0) / n),
        processingMs: Math.round(results.reduce((s, r) => s + r.processingMs, 0) / n),
        startupMs: Math.round(results.reduce((s, r) => s + r.startupMs, 0) / n),
        totalMs: Math.round(results.reduce((s, r) => s + r.totalMs, 0) / n),
        playbackUrl: results[0].playbackUrl,
        status: "success" as const,
      };
    });
  }

  // ── Render ────────────────────────────────────────────────────────

  const allResults = runs.flatMap((r) => r.results);
  const aggregated = runs.length > 1 ? aggregateResults() : allResults;
  const hasResults = allResults.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
          Video Benchmark
        </h1>

        {/* ── Upload & Config ──────────────────────────────────── */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-6">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Select video file(s)
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            disabled={running}
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="block w-full text-sm text-zinc-500 dark:text-zinc-400
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
              dark:file:bg-blue-900/30 dark:file:text-blue-300
              hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50
              disabled:opacity-50"
          />
          {files.length > 0 && (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {files.length} file(s) selected:{" "}
              {files.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join(", ")}
            </p>
          )}

          {/* Provider checkboxes */}
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Providers
            </p>
            <div className="flex flex-wrap gap-3">
              {PROVIDERS.map((p) => (
                <label
                  key={p.slug}
                  className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={enabled.has(p.slug)}
                    onChange={() => toggleProvider(p.slug)}
                    disabled={running}
                    className="rounded border-zinc-300 dark:border-zinc-600"
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={runBenchmark}
              disabled={running || files.length === 0 || enabled.size === 0}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {running ? "Running..." : "Upload & Benchmark"}
            </button>
            {running && (
              <button
                onClick={reset}
                className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2
                  text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100
                  dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
            )}
            {hasResults && !running && (
              <button
                onClick={downloadCsv}
                className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2
                  text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100
                  dark:hover:bg-zinc-800 transition-colors"
              >
                Export CSV
              </button>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* ── Progress ─────────────────────────────────────────── */}
        {progress && (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {progress.providerName}
                  <span className="ml-2 text-zinc-500 capitalize">
                    — {progress.step}
                  </span>
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {progress.fileName} | {progress.detail}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Results Table(s) ─────────────────────────────────── */}
        {runs.map((run, ri) => (
          <div
            key={ri}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-6"
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

        {/* ── Aggregated (multi-file) ──────────────────────────── */}
        {runs.length > 1 && aggregated.length > 0 && (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Aggregated Averages
              </h2>
            </div>
            <ResultsTable results={aggregated} />
          </div>
        )}

        {/* ── Charts ───────────────────────────────────────────── */}
        {hasResults && <Charts results={aggregated} />}

        {/* ── Hidden video element for startup measurement ────── */}
        <video
          ref={videoRef}
          muted
          playsInline
          className="fixed opacity-0 pointer-events-none w-0 h-0"
        />

        {!hasResults && !running && (
          <p className="text-center text-sm text-zinc-400 dark:text-zinc-600 mt-8">
            Select video file(s), choose providers, and click &quot;Upload &amp; Benchmark&quot;.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Results Table Component ─────────────────────────────────────────

function ResultsTable({ results }: { results: ProviderMetrics[] }) {
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
            className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
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

function fmt(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}
