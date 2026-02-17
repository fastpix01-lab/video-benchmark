"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Hls from "hls.js";
import type { ProviderMetrics } from "@/lib/providers/types";
import type { Progress } from "@/hooks/useBenchmark";
import { PROVIDERS } from "@/lib/constants";

type ProviderState = "pending" | "uploading" | "processing" | "measuring" | "ready" | "failed";

interface ProviderEntry {
  slug: string;
  name: string;
  state: ProviderState;
  playbackUrl: string;
  error?: string;
}

interface ProviderVideoPlayerProps {
  enabledProviders: Set<string>;
  allResults: ProviderMetrics[];
  progress: Progress | null;
  running: boolean;
}

export default function ProviderVideoPlayer({
  enabledProviders,
  allResults,
  progress,
  running,
}: ProviderVideoPlayerProps) {
  const [activeSlug, setActiveSlug] = useState<string>("");
  const [playerState, setPlayerState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  // Track which URL is currently loaded to avoid reloading same stream
  const loadedUrlRef = useRef<string>("");
  // Track whether we've auto-played the first ready provider this run
  const autoPlayedRef = useRef(false);

  const providers: ProviderEntry[] = useMemo(() =>
    PROVIDERS
      .filter((p) => enabledProviders.has(p.slug))
      .map((p) => {
        const result = allResults.find((r) => r.provider === p.slug);
        let state: ProviderState = "pending";
        if (result) {
          state = result.status === "success" && result.playbackUrl ? "ready" : "failed";
        } else if (progress?.providerSlug === p.slug) {
          state = progress.step;
        }
        return {
          slug: p.slug,
          name: p.name,
          state,
          playbackUrl: result?.playbackUrl || "",
          error: result?.error,
        };
      }),
    [enabledProviders, allResults, progress]
  );

  // Derive the first ready provider's slug+url as a stable string for the effect
  const firstReady = providers.find((p) => p.state === "ready");
  const firstReadyKey = firstReady ? `${firstReady.slug}|${firstReady.playbackUrl}` : "";

  function destroyHls() {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }

  function loadAndPlay(url: string) {
    const video = videoRef.current;
    if (!video || !url) return;

    // Already playing this URL — do nothing
    if (loadedUrlRef.current === url && playerState === "playing") return;

    destroyHls();
    video.pause();
    video.removeAttribute("src");
    video.load();
    loadedUrlRef.current = url;
    setPlayerState("loading");
    setErrorMsg("");

    function onPlaying() {
      setPlayerState("playing");
    }

    function onError() {
      setPlayerState("error");
      setErrorMsg(video!.error?.message || "Playback failed");
    }

    video.addEventListener("playing", onPlaying, { once: true });
    video.addEventListener("error", onError, { once: true });

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;

      hls.on(Hls.Events.ERROR, (_e, d) => {
        if (d.fatal) {
          setPlayerState("error");
          setErrorMsg(`HLS error: ${d.details}`);
        }
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      // Don't auto-play on manifest parsed — just make the video ready.
      // The native controls play button will work, or we call play() below.
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay blocked by browser — that's fine, user can use controls
          setPlayerState("playing");
        });
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {
          setPlayerState("playing");
        });
      }, { once: true });
    } else {
      setPlayerState("error");
      setErrorMsg("HLS playback is not supported in this browser");
    }
  }

  function handleProviderClick(entry: ProviderEntry) {
    if (entry.state === "failed") {
      // Just show the error, don't try to load
      destroyHls();
      loadedUrlRef.current = "";
      setActiveSlug(entry.slug);
      setPlayerState("idle");
      return;
    }
    if (entry.state === "ready" && entry.playbackUrl) {
      setActiveSlug(entry.slug);
      loadAndPlay(entry.playbackUrl);
    }
  }

  // Auto-play the first provider that becomes ready
  useEffect(() => {
    if (!firstReady || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    setActiveSlug(firstReady.slug);
    loadAndPlay(firstReady.playbackUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstReadyKey]);

  // Reset auto-play flag when a new benchmark starts
  useEffect(() => {
    if (running && allResults.length === 0) {
      autoPlayedRef.current = false;
      loadedUrlRef.current = "";
      setActiveSlug("");
      setPlayerState("idle");
    }
  }, [running, allResults.length]);

  const activeEntry = providers.find((p) => p.slug === activeSlug);
  const hasAnyEnabled = providers.length > 0;

  function stateLabel(state: ProviderState): string {
    switch (state) {
      case "pending": return "Waiting";
      case "uploading": return "Uploading";
      case "processing": return "Processing";
      case "measuring": return "Measuring";
      case "ready": return "Ready";
      case "failed": return "Failed";
    }
  }

  function stateDot(state: ProviderState) {
    switch (state) {
      case "ready":
        return <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />;
      case "failed":
        return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />;
      case "uploading":
      case "processing":
      case "measuring":
        return (
          <svg className="w-3 h-3 animate-spin text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        );
      default:
        return <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />;
    }
  }

  // Show idle placeholder when nothing is selected or active entry isn't loaded
  const showIdle = !activeSlug || (playerState === "idle" && activeEntry?.state !== "failed");

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
          </svg>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Playback Preview
          </h2>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative bg-black">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <video
            ref={videoRef}
            controls
            playsInline
            muted
            className="absolute inset-0 w-full h-full"
          />

          {/* Idle — nothing selected */}
          {showIdle && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
              <svg className="w-12 h-12 text-zinc-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
              </svg>
              <p className="text-xs text-zinc-500 text-center px-4">
                {!hasAnyEnabled
                  ? "Select providers and start benchmark"
                  : running
                    ? "Waiting for a provider to finish..."
                    : "Click a ready provider below to preview"}
              </p>
            </div>
          )}

          {/* Loading overlay */}
          {playerState === "loading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-2" />
              <p className="text-xs text-zinc-400">Loading stream...</p>
            </div>
          )}

          {/* Error overlay */}
          {playerState === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <svg className="w-8 h-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-xs text-red-400 text-center px-4 mb-2">{errorMsg}</p>
              <button
                onClick={() => {
                  if (activeEntry?.playbackUrl) loadAndPlay(activeEntry.playbackUrl);
                }}
                className="text-xs text-zinc-400 hover:text-white transition-colors underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Failed provider selected */}
          {activeEntry?.state === "failed" && playerState === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
              <svg className="w-8 h-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-xs text-red-400 text-center px-4">
                {activeEntry.error || "Upload or processing failed"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Provider List */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        {providers.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              No providers selected
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {providers.map((p) => {
              const isReady = p.state === "ready";
              const isFailed = p.state === "failed";
              const isActive = p.slug === activeSlug;
              const canSelect = isReady || isFailed;

              return (
                <button
                  key={p.slug}
                  disabled={!canSelect}
                  onClick={() => handleProviderClick(p)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150
                    ${isActive
                      ? "bg-blue-50 dark:bg-blue-950/30"
                      : canSelect
                        ? "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                >
                  {stateDot(p.state)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-zinc-700 dark:text-zinc-300"
                    }`}>
                      {p.name}
                    </p>
                  </div>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                    isReady
                      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                      : isFailed
                        ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}>
                    {stateLabel(p.state)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Playback URL footer */}
      {activeEntry?.playbackUrl && (
        <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate font-mono">
            {activeEntry.playbackUrl}
          </p>
        </div>
      )}
    </div>
  );
}
