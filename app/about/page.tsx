import type { Metadata } from "next";
import Link from "next/link";
import { LINKEDIN_URL } from "@/app/components/AuthorLink";

export const metadata: Metadata = {
  title: "About — StreamBench",
  description:
    "StreamBench is an independent video infrastructure benchmarking platform measuring real-world performance across streaming providers.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-16 pb-12">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3 tracking-wide uppercase">
            About
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            About StreamBench
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Independent, data-driven benchmarking for video streaming infrastructure.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        {/* Mission */}
        <section>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              The Platform
            </h2>
            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                StreamBench is an independent video infrastructure benchmarking platform designed to
                measure real-world performance across streaming providers.
              </p>
              <p>
                It evaluates upload time, processing time, and startup latency (time-to-first-frame)
                using real browser conditions and standardized testing workflows. The goal is to
                provide transparent, comparable insights into how video platforms perform beyond
                marketing claims.
              </p>
            </div>
          </div>
        </section>

        {/* What we measure */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
            What We Measure
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: "Upload Time",
                description: "Full duration from initiating the upload to receiving provider confirmation.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Processing Time",
                description: "Time from upload completion until the video is ready for playback.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                title: "Startup Latency",
                description: "Time-to-first-frame measured using hls.js in real browser conditions.",
                gradient: "from-emerald-500 to-teal-500",
              },
            ].map((metric) => (
              <div
                key={metric.title}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.gradient} mb-3`} />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                  {metric.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Providers */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
            Providers Tested
          </p>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              {["Mux", "FastPix", "api.video", "Cloudinary", "Gumlet"].map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              All providers are tested sequentially with the same file to ensure fair, reproducible
              comparisons. Results include upload speed, processing time, and playback startup latency.
            </p>
          </div>
        </section>

        {/* About the Creator */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
            About the Creator
          </p>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                KP
              </div>
              <div>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 transition-colors duration-150"
                >
                  Kalyan Pilli
                </a>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  SDET &middot; Video Infrastructure Benchmarking
                </p>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Kalyan Pilli is a Software Development Engineer in Test (SDET) specializing in
                  video infrastructure testing, streaming performance measurement, and automation
                  systems. StreamBench was built as an independent project to bring measurable,
                  data-driven clarity to video platform performance.
                </p>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 transition-colors duration-150"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-4">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">
            See how video providers compare in real-world conditions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/benchmark"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-150"
            >
              Run a Benchmark
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              How We Test
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
