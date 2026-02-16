import type { BenchmarkRun } from "@/lib/providers/types";

export function generateCsvContent(runs: BenchmarkRun[]): string {
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
  return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}

export function downloadCsv(runs: BenchmarkRun[]) {
  const csv = generateCsvContent(runs);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `benchmark-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJson(runs: BenchmarkRun[]) {
  const data = {
    timestamp: new Date().toISOString(),
    runs: runs.map((run) => ({
      fileName: run.fileName,
      fileSize: run.fileSize,
      results: run.results.map((r) => ({
        provider: r.provider,
        providerName: r.providerName,
        uploadMs: r.uploadMs,
        processingMs: r.processingMs,
        startupMs: r.startupMs,
        totalMs: r.totalMs,
        status: r.status,
        error: r.error || undefined,
      })),
    })),
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `benchmark-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
