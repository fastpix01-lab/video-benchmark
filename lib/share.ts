import type { BenchmarkRun } from "@/lib/providers/types";

export function encodeResults(runs: BenchmarkRun[]): string {
  const compact = runs.map((run) => ({
    f: run.fileName,
    s: run.fileSize,
    r: run.results.map((r) => ({
      p: r.provider,
      n: r.providerName,
      u: r.uploadMs,
      pr: r.processingMs,
      st: r.startupMs,
      t: r.totalMs,
      s: r.status,
      e: r.error,
    })),
  }));
  return btoa(JSON.stringify(compact));
}

export function decodeResults(encoded: string): BenchmarkRun[] | null {
  try {
    const compact = JSON.parse(atob(encoded));
    return compact.map((run: { f: string; s: number; r: Array<{ p: string; n: string; u: number; pr: number; st: number; t: number; s: string; e?: string }> }) => ({
      fileName: run.f,
      fileSize: run.s,
      results: run.r.map((r) => ({
        provider: r.p,
        providerName: r.n,
        uploadMs: r.u,
        processingMs: r.pr,
        startupMs: r.st,
        totalMs: r.t,
        playbackUrl: "",
        status: r.s as "success" | "failed",
        error: r.e,
      })),
    }));
  } catch {
    return null;
  }
}
