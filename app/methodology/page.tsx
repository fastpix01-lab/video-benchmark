import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Test — StreamBench",
  description: "How StreamBench measures video infrastructure performance across providers.",
};

const METRICS = [
  {
    title: "Upload Time",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-500",
    description: "Measures the full duration from initiating the upload to receiving confirmation that the file has been received by the provider.",
    details: [
      "Creating the upload session (signed URL or token)",
      "Transferring the file data to the provider",
      "Receiving the completion response",
    ],
    notes: "FastPix uses their resumable uploads SDK with 16 MB chunks. Mux and Cloudinary support direct browser-to-provider uploads. api.video and Gumlet upload directly from the browser with authentication headers.",
  },
  {
    title: "Processing Time",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    description: "Measured by polling the provider's status API until the video is reported as ready for playback.",
    details: [
      "Polling interval: every 3 seconds",
      "Timeout: 5 minutes maximum",
      "Clock starts immediately after upload completion",
      "Stops when a playback URL is returned",
    ],
    notes: "Most providers complete processing within 2-3 minutes for standard-length videos. If processing exceeds the 5-minute timeout, the benchmark records a failure.",
  },
  {
    title: "Startup Time (TTFF)",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-500",
    description: "Time-to-first-frame — the most user-facing metric. Measured using hls.js in the browser.",
    details: [
      "Load HLS manifest into hls.js",
      "Wait for MANIFEST_PARSED event",
      "Call video.play() and start timer",
      "Stop on playing event — first frame rendered",
    ],
    notes: "Captures the real-world playback experience including manifest download, first segment download, and video decode time.",
  },
];

const CONDITIONS = [
  { label: "Sequential testing", description: "All providers tested with the same file, one at a time" },
  { label: "Retry logic", description: "Up to 2 retries (3 total attempts) for transient errors" },
  { label: "Muted playback", description: "Video element is muted to avoid autoplay restrictions" },
  { label: "Multi-file aggregation", description: "Results averaged across multiple files for reliability" },
];

const LIMITATIONS = [
  { title: "Network dependency", description: "Results are influenced by your connection speed and latency to each provider's servers." },
  { title: "Sequential order", description: "Providers tested later may benefit slightly from warmed-up network connections." },
  { title: "Single-region", description: "Benchmarks run from a single location — results may vary from different geographic regions." },
  { title: "'Ready' definition", description: "Providers define 'ready' differently: some report when the lowest quality is done, others wait for all renditions." },
];

export default function HowWeTestPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 to-transparent dark:from-violet-950/20 dark:to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-3 tracking-wide uppercase">
            Methodology
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            How We Test
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            StreamBench measures three key metrics for each provider — upload time, processing time, and startup latency — using real video files in real browser conditions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        {/* Overview */}
        <section>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">Overview</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Each provider is benchmarked sequentially with the same file to ensure fair comparison. We upload the video, wait for processing to complete, then measure how quickly the first frame renders in the browser. The entire pipeline — from file selection to playback — is timed with millisecond precision.
            </p>
          </div>
        </section>

        {/* Metric cards */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
            What We Measure
          </p>
          <div className="space-y-6">
            {METRICS.map((metric) => (
              <div key={metric.title} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center text-white`}>
                      {metric.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {metric.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                        {metric.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Steps */}
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                        How it works
                      </p>
                      <ol className="space-y-2">
                        {metric.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-0.5">
                              {i + 1}
                            </span>
                            {detail}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                        Notes
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {metric.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Test Conditions */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
            Test Conditions
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {CONDITIONS.map((c) => (
              <div key={c.label} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 transition-shadow duration-300 hover:shadow-md hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50">
                <div className="flex items-center gap-2.5 mb-2">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{c.label}</h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pl-6.5">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
            Known Limitations
          </p>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
            {LIMITATIONS.map((l) => (
              <div key={l.title} className="p-5 flex items-start gap-3 transition-colors duration-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{l.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{l.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-4">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">
            Ready to see how your providers compare?
          </p>
          <Link
            href="/benchmark"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-150"
          >
            Run a Benchmark
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  );
}
