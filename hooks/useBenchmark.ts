"use client";

import { useState, useRef, useCallback } from "react";
import Hls from "hls.js";
import { Uploader } from "@fastpix/resumable-uploads";
import type {
  ProviderMetrics,
  AdvancedMetrics,
  BenchmarkRun,
  CreateUploadResult,
  StatusResult,
} from "@/lib/providers/types";
import { PROVIDERS, DEFAULT_ENABLED, MAX_RETRIES, POLL_INTERVAL, POLL_TIMEOUT, NETWORK_PRESETS, ADVANCED_PLAYBACK_DURATION } from "@/lib/constants";

export type Step = "uploading" | "processing" | "measuring";

export interface Progress {
  fileIndex: number;
  fileName: string;
  providerSlug: string;
  providerName: string;
  step: Step;
  detail: string;
}

export function useBenchmark() {
  const [files, setFiles] = useState<File[]>([]);
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(DEFAULT_ENABLED)
  );
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [runs, setRuns] = useState<BenchmarkRun[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [advancedEnabled, setAdvancedEnabled] = useState(false);
  const [networkPreset, setNetworkPreset] = useState<"3g" | "2g">("3g");

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
          const createRes = await fetch(`/api/providers/${slug}/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin: window.location.origin }),
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

        let advanced: AdvancedMetrics | undefined;
        if (advancedEnabled) {
          setProgress({
            fileIndex,
            fileName: file.name,
            providerSlug: slug,
            providerName: name,
            step: "measuring",
            detail: "Running advanced metrics...",
          });
          advanced = await measureAdvancedMetrics(video, status.playbackUrl, NETWORK_PRESETS[networkPreset]);
        }

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
          advanced,
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

    // FastPix: use their resumable uploads SDK (GCS resumable upload protocol)
    // The SDK sends POST with x-goog-resumable header to initiate a session,
    // then PUTs chunks with Content-Range directly from the browser.
    // chunkSize is in KB per SDK docs — 16 * 1024 KB = 16 MB (default).
    if (upload.sdkUpload) {
      await new Promise<void>((resolve, reject) => {
        try {
          const uploader = Uploader.init({
            endpoint: upload.url,
            file,
            chunkSize: 16 * 1024, // 16 MB in KB (SDK uses KB, not bytes)
          });

          uploader.on("success", () => resolve());
          uploader.on("error", (event) => {
            reject(
              new Error(
                event.detail.message || "FastPix SDK upload failed"
              )
            );
          });
        } catch (err) {
          reject(
            new Error(
              `FastPix SDK init failed: ${err instanceof Error ? err.message : "unknown"}`
            )
          );
        }
      });
      return;
    }

    // All other providers: direct browser upload via fetch
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

  // ── Advanced Metrics Measurement ─────────────────────────────────

  async function measureAdvancedMetrics(
    video: HTMLVideoElement,
    playbackUrl: string,
    preset: { label: string; maxBandwidthKbps: number }
  ): Promise<AdvancedMetrics> {
    // Clean up any existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();
    video.muted = true;
    video.playsInline = true;

    return new Promise<AdvancedMetrics>((resolve, reject) => {
      if (!Hls.isSupported()) {
        reject(new Error("HLS not supported for advanced metrics"));
        return;
      }

      const hls = new Hls({
        maxMaxBufferLength: 30,
        capLevelToPlayerSize: false,
        // Cap bandwidth estimate at ABR level (HLS.js uses bits/sec)
        abrEwmaDefaultEstimate: preset.maxBandwidthKbps * 1000,
        abrEwmaDefaultEstimateMax: preset.maxBandwidthKbps * 1000,
      });

      let throttledStartupMs = 0;
      let rebufferCount = 0;
      let rebufferDurationMs = 0;
      let rebufferStart: number | null = null;
      let levelSwitchCount = 0;
      const bitrates: number[] = [];
      let playbackStarted = false;

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Advanced metrics timed out (45s)"));
      }, 45000);

      function cleanup() {
        clearTimeout(timeout);
        video.removeEventListener("waiting", onWaiting);
        video.removeEventListener("playing", onPlayingDuringObservation);
        hls.destroy();
      }

      function onWaiting() {
        if (playbackStarted) {
          rebufferCount++;
          rebufferStart = performance.now();
        }
      }

      function onPlayingDuringObservation() {
        if (rebufferStart !== null) {
          rebufferDurationMs += performance.now() - rebufferStart;
          rebufferStart = null;
        }
      }

      hls.on(Hls.Events.ERROR, (_e, d) => {
        if (d.fatal) {
          cleanup();
          reject(new Error(`HLS error during advanced metrics: ${d.details}`));
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, (_e, d) => {
        const bytes = d.frag.stats.total;
        const loadTimeMs = d.frag.stats.loading.end - d.frag.stats.loading.start;
        if (loadTimeMs > 0 && bytes > 0) {
          const bitrateKbps = (bytes * 8) / loadTimeMs; // bits/ms = Kbps
          bitrates.push(bitrateKbps);
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        levelSwitchCount++;
      });

      hls.loadSource(playbackUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Phase 1: Measure throttled TTFF
        const ttffStart = performance.now();
        video.addEventListener("playing", function onFirstPlay() {
          video.removeEventListener("playing", onFirstPlay);
          throttledStartupMs = Math.round(performance.now() - ttffStart);
          playbackStarted = true;

          // Phase 2: Observe playback for ADVANCED_PLAYBACK_DURATION
          video.addEventListener("waiting", onWaiting);
          video.addEventListener("playing", onPlayingDuringObservation);

          setTimeout(() => {
            // Close any open rebuffer window
            if (rebufferStart !== null) {
              rebufferDurationMs += performance.now() - rebufferStart;
              rebufferStart = null;
            }

            const playbackDurationMs = ADVANCED_PLAYBACK_DURATION;
            const rebufferRatio = playbackDurationMs > 0 ? rebufferDurationMs / playbackDurationMs : 0;
            const averageBitrateKbps = bitrates.length > 0
              ? Math.round(bitrates.reduce((a, b) => a + b, 0) / bitrates.length)
              : 0;
            const peakBitrateKbps = bitrates.length > 0
              ? Math.round(Math.max(...bitrates))
              : 0;
            const smoothnessScore = Math.max(0, Math.round(100 - rebufferCount * 15 - levelSwitchCount * 5));

            cleanup();

            resolve({
              throttledStartupMs,
              networkPreset: networkPreset,
              maxBandwidthKbps: preset.maxBandwidthKbps,
              rebufferCount,
              rebufferDurationMs: Math.round(rebufferDurationMs),
              rebufferRatio: +rebufferRatio.toFixed(4),
              averageBitrateKbps,
              peakBitrateKbps,
              smoothnessScore,
              levelSwitchCount,
              playbackDurationMs,
            });
          }, ADVANCED_PLAYBACK_DURATION);
        }, { once: true });

        video.play().catch((e) => {
          cleanup();
          reject(e);
        });
      });
    });
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
      const avg = (fn: (r: ProviderMetrics) => number) =>
        Math.round(results.reduce((s, r) => s + fn(r), 0) / n);

      const hasAdvanced = results.every((r) => r.advanced);
      const advanced: AdvancedMetrics | undefined = hasAdvanced
        ? {
            throttledStartupMs: avg((r) => r.advanced!.throttledStartupMs),
            networkPreset: results[0].advanced!.networkPreset,
            maxBandwidthKbps: results[0].advanced!.maxBandwidthKbps,
            rebufferCount: avg((r) => r.advanced!.rebufferCount),
            rebufferDurationMs: avg((r) => r.advanced!.rebufferDurationMs),
            rebufferRatio: +(results.reduce((s, r) => s + r.advanced!.rebufferRatio, 0) / n).toFixed(4),
            averageBitrateKbps: avg((r) => r.advanced!.averageBitrateKbps),
            peakBitrateKbps: avg((r) => r.advanced!.peakBitrateKbps),
            smoothnessScore: avg((r) => r.advanced!.smoothnessScore),
            levelSwitchCount: avg((r) => r.advanced!.levelSwitchCount),
            playbackDurationMs: avg((r) => r.advanced!.playbackDurationMs),
          }
        : undefined;

      return {
        provider: results[0].provider,
        providerName: results[0].providerName,
        uploadMs: avg((r) => r.uploadMs),
        processingMs: avg((r) => r.processingMs),
        startupMs: avg((r) => r.startupMs),
        totalMs: avg((r) => r.totalMs),
        playbackUrl: results[0].playbackUrl,
        status: "success" as const,
        advanced,
      };
    });
  }

  const allResults = runs.flatMap((r) => r.results);
  const aggregated = runs.length > 1 ? aggregateResults() : allResults;
  const hasResults = allResults.length > 0;

  return {
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
  };
}
