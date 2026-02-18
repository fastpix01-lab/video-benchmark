import type { Metadata } from "next";
import Link from "next/link";
import { LINKEDIN_URL } from "@/app/components/AuthorLink";

export const metadata: Metadata = {
  title: "How We Test — StreamBench",
  description:
    "Detailed methodology for how StreamBench measures upload speed, processing time, startup latency, network throttling, rebuffering, bitrate, and smoothness across video infrastructure providers.",
};

export default function HowWeTestPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 to-transparent dark:from-violet-950/20 dark:to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-16 pb-12">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-3 tracking-wide uppercase">
            Methodology
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            How We Test
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            StreamBench measures 7 performance metrics across 6 video infrastructure providers using real video files in real browser conditions. This page documents every measurement, every calculation, and every design decision behind our benchmarking methodology.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:not-italic prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-td:py-2">

          {/* ── Overview ──────────────────────────────────── */}
          <h2>Overview</h2>
          <p>
            StreamBench is an open-source, browser-based benchmarking tool that measures the end-to-end performance of video infrastructure providers. It tests the complete video pipeline: upload, server-side processing, and client-side playback — including advanced metrics under simulated network conditions.
          </p>
          <p>
            We measure <strong>7 metrics</strong> organized into two tiers:
          </p>
          <table>
            <thead>
              <tr><th>Tier</th><th>Metric</th><th>What It Measures</th></tr>
            </thead>
            <tbody>
              <tr><td rowSpan={4}><strong>Core</strong></td><td>Upload Time</td><td>Browser-to-provider file transfer duration</td></tr>
              <tr><td>Processing Time</td><td>Provider-side transcoding to HLS readiness</td></tr>
              <tr><td>Startup Latency (TTFF)</td><td>Time-to-first-frame under normal network</td></tr>
              <tr><td>Total End-to-End Time</td><td>Upload + Processing + Startup combined</td></tr>
              <tr><td rowSpan={3}><strong>Advanced</strong></td><td>Throttled TTFF</td><td>Startup latency under simulated 3G/2G</td></tr>
              <tr><td>Rebuffer Ratio</td><td>Fraction of playback time spent rebuffering</td></tr>
              <tr><td>Smoothness Score</td><td>Composite 0-100 score for playback quality</td></tr>
            </tbody>
          </table>

          {/* ── Test Flow ─────────────────────────────────── */}
          <h2>Test Flow</h2>
          <p>
            Each benchmark executes a sequential pipeline for every file and provider combination. The four phases below run in order, with precise timing captured at each boundary.
          </p>
        </div>

        {/* ── Visual Process Flow (outside prose) ─── */}
        <div className="my-12">
          {/* Trigger card */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-3 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">User initiates benchmark</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Selects file(s) and provider(s)</p>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-6">
            <div className="w-px h-8 bg-gradient-to-b from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800" />
          </div>

          {/* Phase cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Phase 1: Upload */}
            <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-900">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Phase 1</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">Upload</h3>
                    <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                        Request signed URL or session token
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                        Transfer file to provider endpoint
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                        Confirm receipt
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20">
                        uploadMs
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">via performance.now()</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2: Processing */}
            <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 dark:hover:shadow-amber-500/5 hover:border-amber-200 dark:hover:border-amber-900">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Phase 2</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">Processing</h3>
                    <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                        Poll status API every 3 seconds
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                        Wait for transcoding and HLS packaging
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                        Timeout after 5 minutes
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-700/10 dark:ring-amber-400/20">
                        processingMs
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">poll until ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3: Startup */}
            <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-900">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Phase 3</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">Startup (TTFF)</h3>
                    <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                        Load HLS manifest via hls.js
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                        Call play() on MANIFEST_PARSED
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
                        Capture first frame render
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-700/10 dark:ring-emerald-400/20">
                        startupMs
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">play() → playing event</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 4: Advanced Metrics */}
            <div className="group relative rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 dark:hover:shadow-violet-500/5 hover:border-violet-300 dark:hover:border-violet-800">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-sm shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Phase 4</span>
                      <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-950/40 px-1.5 py-0.5 text-[9px] font-semibold text-violet-600 dark:text-violet-400">OPTIONAL</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">Advanced Metrics</h3>
                    <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />
                        Throttled TTFF under 3G / 2G
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />
                        10s playback observation
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-500 flex-shrink-0" />
                        Rebuffers, bitrate, smoothness
                      </li>
                    </ul>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded-md bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:text-violet-400 ring-1 ring-inset ring-violet-700/10 dark:ring-violet-400/20">
                        advanced
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500">bandwidth-capped HLS.js</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connector + Result */}
          <div className="flex justify-center mt-6 mb-2">
            <div className="w-px h-8 bg-gradient-to-b from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
          </div>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 shadow-sm shadow-emerald-500/20">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm font-semibold text-white">Results recorded</span>
            </div>
          </div>
        </div>

        {/* Resume prose */}
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:not-italic prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-td:py-2">

          {/* ── Metric 1: Upload Time ─────────────────────── */}
          <h2>Metric 1: Upload Time</h2>
          <p>
            Upload time measures the duration from initiating the upload request to receiving confirmation that the file has been fully received by the provider. The clock starts before the first byte is sent and stops after the final response is received.
          </p>

          <h3>How It Works</h3>
          <ol>
            <li><strong>Create upload session.</strong> A POST request to <code>/api/providers/&#123;slug&#125;/upload</code> obtains a signed upload URL or session token from the provider.</li>
            <li><strong>Transfer the file.</strong> The file is sent directly from the browser to the provider&apos;s upload endpoint. For providers requiring CORS proxying (api.video, Gumlet, Vimeo), the file is relayed through our backend.</li>
            <li><strong>Confirm receipt.</strong> The upload is complete when the provider returns a success response (HTTP 200/201).</li>
          </ol>

          <h3>Pseudo-Code</h3>
          <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
              <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/70" />
              <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">upload-timing.ts</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-5 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed font-mono text-zinc-800 dark:text-zinc-200"><code>{`const uploadStart = performance.now();

`}<span className="text-zinc-500 dark:text-zinc-500">{`// Step 1: Get upload URL from provider`}</span>{`
const { trackingId, upload } = `}<span className="text-blue-600 dark:text-blue-400">{`await`}</span>{` fetch(
  \`/api/providers/\${slug}/upload\`,
  { method: `}<span className="text-emerald-600 dark:text-emerald-400">{`"POST"`}</span>{`, body: JSON.stringify({ origin }) }
).then(r => r.json());

`}<span className="text-zinc-500 dark:text-zinc-500">{`// Step 2: Transfer file to provider`}</span>{`
`}<span className="text-blue-600 dark:text-blue-400">{`await`}</span>{` fetch(upload.url, {
  method: upload.method,   `}<span className="text-zinc-500 dark:text-zinc-500">{`// PUT or POST`}</span>{`
  body: file,              `}<span className="text-zinc-500 dark:text-zinc-500">{`// raw File object`}</span>{`
  headers: { `}<span className="text-emerald-600 dark:text-emerald-400">{`"Content-Type"`}</span>{`: file.type }
});

`}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` uploadMs = Math.round(performance.now() - uploadStart);`}</code></pre>
            </div>
          </div>

          <h3>Provider-Specific Upload Methods</h3>
          <table>
            <thead>
              <tr><th>Provider</th><th>Method</th><th>CORS</th><th>Notes</th></tr>
            </thead>
            <tbody>
              <tr><td>FastPix</td><td>Resumable SDK (16 MB chunks)</td><td>Direct</td><td>Chunked upload with retry</td></tr>
              <tr><td>Mux</td><td>Direct PUT</td><td>Direct</td><td>Single request to signed URL</td></tr>
              <tr><td>api.video</td><td>POST with auth header</td><td>Proxy</td><td>Create container first, then upload</td></tr>
              <tr><td>Cloudinary</td><td>Form-data with signature</td><td>Direct</td><td>Signed params in form fields</td></tr>
              <tr><td>Gumlet</td><td>PUT to signed URL</td><td>Proxy</td><td>Raw binary upload</td></tr>
              <tr><td>Vimeo</td><td>TUS resumable</td><td>Proxy</td><td>Resumable upload protocol</td></tr>
            </tbody>
          </table>

          <blockquote>
            <strong>Fairness note:</strong> Proxy uploads add 100-300 ms of backend relay latency. This is reflected in the upload times for api.video, Gumlet, and Vimeo. We document this clearly in all results.
          </blockquote>

          {/* ── Metric 2: Processing Time ─────────────────── */}
          <h2>Metric 2: Processing Time</h2>
          <p>
            Processing time measures the provider&apos;s server-side transcoding pipeline — from upload completion to HLS playback readiness. This includes video decoding, multi-bitrate transcoding, HLS packaging, manifest generation, and CDN propagation.
          </p>

          <h3>How It Works</h3>
          <ol>
            <li><strong>Start the clock</strong> immediately after upload completes.</li>
            <li><strong>Poll the status API</strong> at <code>/api/providers/&#123;slug&#125;/status/&#123;id&#125;</code> every <strong>3 seconds</strong>.</li>
            <li><strong>Stop the clock</strong> when the provider returns <code>ready: true</code> with a valid <code>playbackUrl</code>.</li>
            <li><strong>Timeout</strong> after <strong>5 minutes</strong> (300 seconds) if the provider hasn&apos;t reported readiness.</li>
          </ol>

          <h3>Pseudo-Code</h3>
          <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
              <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/70" />
              <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">processing-poll.ts</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-5 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed font-mono text-zinc-800 dark:text-zinc-200"><code>{``}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` processStart = performance.now();
`}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` POLL_INTERVAL = `}<span className="text-amber-600 dark:text-amber-400">{`3_000`}</span>{`;  `}<span className="text-zinc-500 dark:text-zinc-500">{`// 3 seconds`}</span>{`
`}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` POLL_TIMEOUT = `}<span className="text-amber-600 dark:text-amber-400">{`300_000`}</span>{`; `}<span className="text-zinc-500 dark:text-zinc-500">{`// 5 minutes`}</span>{`
`}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` deadline = Date.now() + POLL_TIMEOUT;

`}<span className="text-blue-600 dark:text-blue-400">{`while`}</span>{` (Date.now() < deadline) {
  `}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` status = `}<span className="text-blue-600 dark:text-blue-400">{`await`}</span>{` fetch(
    \`/api/providers/\${slug}/status/\${trackingId}\`
  ).then(r => r.json());

  `}<span className="text-blue-600 dark:text-blue-400">{`if`}</span>{` (status.ready) {
    `}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` processingMs = Math.round(
      performance.now() - processStart
    );
    `}<span className="text-blue-600 dark:text-blue-400">{`return`}</span>{` { processingMs, playbackUrl: status.playbackUrl };
  }

  `}<span className="text-blue-600 dark:text-blue-400">{`if`}</span>{` (status.failed) {
    `}<span className="text-blue-600 dark:text-blue-400">{`throw new`}</span>{` Error(status.error || `}<span className="text-emerald-600 dark:text-emerald-400">{`"Processing failed"`}</span>{`);
  }

  `}<span className="text-blue-600 dark:text-blue-400">{`await new`}</span>{` Promise(r => setTimeout(r, POLL_INTERVAL));
}`}</code></pre>
            </div>
          </div>

          <blockquote>
            <strong>Note on &quot;ready&quot; definitions:</strong> Providers define readiness differently. Some (like api.video) report ready when the lowest-quality rendition is complete. Others (like Cloudinary) wait for all renditions. This affects both processing time measurements and initial playback quality.
          </blockquote>

          {/* ── Metric 3: Startup Latency (TTFF) ──────────── */}
          <h2>Metric 3: Startup Latency (Time-to-First-Frame)</h2>
          <p>
            TTFF measures the time from initiating HLS playback to the first video frame rendering on screen. This is the most viewer-facing metric — it captures the real-world experience of pressing play and waiting for content to appear.
          </p>

          <h3>What TTFF Includes</h3>
          <ol>
            <li><strong>Manifest fetch</strong> — Downloading the HLS .m3u8 manifest from the provider&apos;s CDN</li>
            <li><strong>Manifest parse</strong> — HLS.js parsing the manifest to identify available renditions</li>
            <li><strong>First segment download</strong> — Downloading the first video segment from the CDN edge</li>
            <li><strong>Decode and render</strong> — Browser video decoder producing the first frame</li>
          </ol>

          <h3>How It Works</h3>
          <ol>
            <li>Create a fresh HLS.js instance and load the provider&apos;s playback URL.</li>
            <li>Wait for the <code>MANIFEST_PARSED</code> event (manifest is downloaded and parsed).</li>
            <li>Call <code>video.play()</code> and start the timer using <code>performance.now()</code>.</li>
            <li>Listen for the <code>playing</code> event on the video element — this fires when the first frame is rendered and playback begins.</li>
            <li>Stop the timer. The difference is <code>startupMs</code>.</li>
          </ol>

          <h3>Pseudo-Code</h3>
          <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
              <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/70" />
              <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">measure-ttff.ts</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-5 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed font-mono text-zinc-800 dark:text-zinc-200"><code>{``}<span className="text-blue-600 dark:text-blue-400">{`function`}</span>{` measureStartupTime(
  video: `}<span className="text-amber-600 dark:text-amber-400">{`HTMLVideoElement`}</span>{`,
  playbackUrl: `}<span className="text-amber-600 dark:text-amber-400">{`string`}</span>{`
): `}<span className="text-amber-600 dark:text-amber-400">{`Promise<number>`}</span>{` {
  `}<span className="text-blue-600 dark:text-blue-400">{`return new`}</span>{` Promise((resolve, reject) => {
    `}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` hls = `}<span className="text-blue-600 dark:text-blue-400">{`new`}</span>{` Hls();
    hls.loadSource(playbackUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      `}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` start = performance.now();

      video.addEventListener(`}<span className="text-emerald-600 dark:text-emerald-400">{`"playing"`}</span>{`, () => {
        resolve(Math.round(performance.now() - start));
      }, { once: `}<span className="text-amber-600 dark:text-amber-400">{`true`}</span>{` });

      video.play().catch(reject);
    });

    hls.on(Hls.Events.ERROR, (_e, data) => {
      `}<span className="text-blue-600 dark:text-blue-400">{`if`}</span>{` (data.fatal) reject(`}<span className="text-blue-600 dark:text-blue-400">{`new`}</span>{` Error(data.details));
    });
  });
}`}</code></pre>
            </div>
          </div>

          <blockquote>
            <strong>Why we start the timer at play(), not at manifest load:</strong> Manifest fetch time is variable and largely dependent on CDN proximity — it&apos;s a network metric, not a provider architecture metric. By starting the timer at <code>play()</code> (after manifest is parsed), we isolate the segment delivery and decode performance, which is more directly controlled by the provider&apos;s infrastructure choices.
          </blockquote>

          {/* ── Metric 4: Network Throttling Simulation ────── */}
          <h2>Metric 4: Network Throttling Simulation</h2>
          <p>
            StreamBench&apos;s advanced metrics mode simulates constrained network conditions to measure how providers perform under real-world mobile bandwidth. This is critical because most providers appear similar under ideal conditions — throttling reveals architectural differences.
          </p>

          <h3>How Throttling Works</h3>
          <p>
            We use HLS.js&apos;s ABR bandwidth estimation parameters to cap the player&apos;s perceived available bandwidth:
          </p>
          <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
              <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/70" />
              <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">throttle-config.ts</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-5 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed font-mono text-zinc-800 dark:text-zinc-200"><code>{``}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` hls = `}<span className="text-blue-600 dark:text-blue-400">{`new`}</span>{` Hls({
  `}<span className="text-zinc-500 dark:text-zinc-500">{`// Cap the ABR bandwidth estimate (bits/sec)`}</span>{`
  abrEwmaDefaultEstimate: preset.maxBandwidthKbps * `}<span className="text-amber-600 dark:text-amber-400">{`1000`}</span>{`,
  abrEwmaDefaultEstimateMax: preset.maxBandwidthKbps * `}<span className="text-amber-600 dark:text-amber-400">{`1000`}</span>{`,
});`}</code></pre>
            </div>
          </div>
          <p>
            This forces HLS.js to select lower-bitrate renditions as if the user were on a constrained connection. The player cannot request renditions that exceed the bandwidth cap.
          </p>

          <h3>Network Presets</h3>
          <table>
            <thead>
              <tr><th>Preset</th><th>Bandwidth Cap</th><th>Simulates</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>3G</strong></td><td>750 Kbps</td><td>Typical 3G mobile connection, urban public Wi-Fi</td></tr>
              <tr><td><strong>2G</strong></td><td>150 Kbps</td><td>Edge/GPRS networks, severely congested connections</td></tr>
            </tbody>
          </table>

          <h3>What We Measure Under Throttling</h3>
          <p>
            The throttled test creates a separate HLS.js instance with bandwidth capping and runs two phases:
          </p>
          <ol>
            <li><strong>Phase 1 — Throttled TTFF:</strong> Same as normal TTFF measurement, but with the bandwidth-capped HLS.js instance. Measures how quickly the provider can deliver a first frame under constrained bandwidth.</li>
            <li><strong>Phase 2 — 10-Second Playback Observation:</strong> After first frame renders, we observe playback for 10 seconds, recording:
              <ul>
                <li><strong>Rebuffer events</strong> — counted via video <code>waiting</code> → <code>playing</code> event pairs</li>
                <li><strong>Rebuffer duration</strong> — total milliseconds spent in buffering state</li>
                <li><strong>Bitrate per fragment</strong> — computed from <code>Hls.Events.FRAG_LOADED</code> stats (bytes / load time)</li>
                <li><strong>ABR switches</strong> — counted via <code>Hls.Events.LEVEL_SWITCHED</code></li>
              </ul>
            </li>
          </ol>

          {/* ── Metric 5: Rebuffer Detection ─────────────── */}
          <h2>Metric 5: Rebuffer Detection</h2>
          <p>
            Rebuffering occurs when the video player exhausts its buffer and must pause playback to download more data. Each rebuffer event degrades viewer experience and increases abandonment risk.
          </p>

          <h3>Detection Method</h3>
          <p>
            We detect rebuffering by listening to two HTML5 video events:
          </p>
          <ul>
            <li><code>waiting</code> — fires when playback pauses because the buffer is empty. We record the timestamp and increment the rebuffer counter.</li>
            <li><code>playing</code> — fires when playback resumes after buffering. We compute the duration since the last <code>waiting</code> event and add it to the cumulative rebuffer duration.</li>
          </ul>

          <h3>Derived Metrics</h3>
          <table>
            <thead>
              <tr><th>Metric</th><th>Formula</th><th>Interpretation</th></tr>
            </thead>
            <tbody>
              <tr><td>Rebuffer Count</td><td>Number of <code>waiting</code> events during observation</td><td>0 = ideal; 2+ = degraded</td></tr>
              <tr><td>Rebuffer Duration</td><td>Sum of all (playing - waiting) intervals</td><td>Total ms of playback interruption</td></tr>
              <tr><td>Rebuffer Ratio</td><td><code>rebufferDurationMs / playbackDurationMs</code></td><td>0.00 = ideal; &gt;0.10 = poor</td></tr>
            </tbody>
          </table>

          {/* ── Metric 6: Bitrate Measurement ────────────── */}
          <h2>Metric 6: Bitrate Measurement</h2>
          <p>
            Average and peak bitrate indicate the quality level the provider&apos;s CDN can sustain under given network conditions. Higher sustained bitrate generally means better visual quality.
          </p>

          <h3>Measurement Logic</h3>
          <p>
            We compute per-fragment bitrate from HLS.js&apos;s <code>FRAG_LOADED</code> event:
          </p>
          <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
              <span className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/70" />
              <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">bitrate-measurement.ts</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-5 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed font-mono text-zinc-800 dark:text-zinc-200"><code>{`hls.on(Hls.Events.FRAG_LOADED, (_event, data) => {
  `}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` bytes = data.frag.stats.total;
  `}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` loadTimeMs =
    data.frag.stats.loading.end -
    data.frag.stats.loading.start;

  `}<span className="text-blue-600 dark:text-blue-400">{`if`}</span>{` (loadTimeMs > `}<span className="text-amber-600 dark:text-amber-400">{`0`}</span>{` && bytes > `}<span className="text-amber-600 dark:text-amber-400">{`0`}</span>{`) {
    `}<span className="text-zinc-500 dark:text-zinc-500">{`// bits per millisecond = Kbps`}</span>{`
    `}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` bitrateKbps = (bytes * `}<span className="text-amber-600 dark:text-amber-400">{`8`}</span>{`) / loadTimeMs;
    bitrates.push(bitrateKbps);
  }
});

`}<span className="text-zinc-500 dark:text-zinc-500">{`// After observation window:`}</span>{`
`}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` averageBitrateKbps = Math.round(
  bitrates.reduce((a, b) => a + b, `}<span className="text-amber-600 dark:text-amber-400">{`0`}</span>{`) / bitrates.length
);
`}<span className="text-violet-600 dark:text-violet-400">{`const`}</span>{` peakBitrateKbps = Math.round(Math.max(...bitrates));`}</code></pre>
            </div>
          </div>

          {/* ── Metric 7: Smoothness Score ────────────────── */}
          <h2>Metric 7: Smoothness Score</h2>
          <p>
            The smoothness score is a composite metric (0-100) that summarizes overall playback quality during the observation window. It penalizes disruptive events that degrade viewer experience.
          </p>

          <h3>Calculation</h3>
          <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
              <svg className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.105.401l1.444-.889" />
              </svg>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Formula</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 px-5 py-4 flex items-center justify-center">
              <code className="text-[14px] font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                smoothnessScore = <span className="text-blue-600 dark:text-blue-400">max</span>(<span className="text-amber-600 dark:text-amber-400">0</span>, <span className="text-amber-600 dark:text-amber-400">100</span> - rebufferCount <span className="text-zinc-500">&times;</span> <span className="text-amber-600 dark:text-amber-400">15</span> - levelSwitchCount <span className="text-zinc-500">&times;</span> <span className="text-amber-600 dark:text-amber-400">5</span>)
              </code>
            </div>
          </div>

          <table>
            <thead>
              <tr><th>Component</th><th>Penalty</th><th>Rationale</th></tr>
            </thead>
            <tbody>
              <tr><td>Rebuffer event</td><td>-15 per event</td><td>Each rebuffer is a visible, disruptive interruption to playback</td></tr>
              <tr><td>ABR switch</td><td>-5 per switch</td><td>ABR switches cause visible quality changes but are less disruptive than rebuffers</td></tr>
            </tbody>
          </table>

          <h3>Score Interpretation</h3>
          <table>
            <thead>
              <tr><th>Score Range</th><th>Rating</th><th>Typical Scenario</th></tr>
            </thead>
            <tbody>
              <tr><td>90-100</td><td>Excellent</td><td>Zero rebuffers, 0-2 ABR switches</td></tr>
              <tr><td>70-89</td><td>Good</td><td>0-1 rebuffer, 2-3 ABR switches</td></tr>
              <tr><td>50-69</td><td>Degraded</td><td>2+ rebuffers or frequent level oscillation</td></tr>
              <tr><td>0-49</td><td>Poor</td><td>Multiple rebuffers and unstable bitrate</td></tr>
            </tbody>
          </table>

          <blockquote>
            <strong>Design decision:</strong> We weight rebuffers 3x more than ABR switches because research shows rebuffering causes 3-4x more viewer abandonment than quality changes (Conviva, 2024). The formula is intentionally simple and interpretable — we prioritize transparency over statistical complexity.
          </blockquote>

          {/* ── Ensuring Fairness ─────────────────────────── */}
          <h2>How We Ensure Fairness Across Providers</h2>
          <p>
            Benchmarking different providers with different APIs and infrastructure requires careful test design to avoid systematic bias. Here are the specific measures we take:
          </p>

          <h3>1. Same File, Same Environment</h3>
          <p>
            Every provider is tested with the identical source file from the same browser, machine, and network connection. File selection, encoding parameters, and content type are controlled variables.
          </p>

          <h3>2. Sequential Execution</h3>
          <p>
            Providers are tested one at a time. This prevents bandwidth competition between simultaneous uploads or playback sessions. The tradeoff is that later providers may benefit slightly from warmed-up network connections — we document this as a known limitation.
          </p>

          <h3>3. Multiple Runs with Aggregation</h3>
          <p>
            When multiple files are tested, results are aggregated by averaging each metric per provider across all files. This reduces the impact of outliers, transient network conditions, and provider-side variability.
          </p>

          <h3>4. Retry Logic</h3>
          <p>
            Each provider gets up to <strong>2 retries</strong> (3 total attempts) if an error occurs during any phase. This handles transient network issues, temporary provider errors, and upload timeout edge cases. Only the successful attempt&apos;s metrics are recorded. If all 3 attempts fail, the provider is marked as failed with the last error message.
          </p>

          <h3>5. Fresh HLS Instance Per Measurement</h3>
          <p>
            Each TTFF measurement creates a new HLS.js instance and resets the video element. This prevents cached manifests, pre-buffered segments, or warmed-up CDN connections from inflating results for subsequent measurements.
          </p>

          <h3>6. Transparent Proxy Documentation</h3>
          <p>
            Providers requiring CORS proxy uploads are clearly identified. The proxy overhead (100-300 ms) is included in the upload time — we don&apos;t adjust or normalize for it, because it reflects the real integration complexity.
          </p>

          {/* ── Known Limitations ─────────────────────────── */}
          <h2>Known Limitations</h2>
          <table>
            <thead>
              <tr><th>Limitation</th><th>Impact</th><th>Mitigation</th></tr>
            </thead>
            <tbody>
              <tr><td>Network dependency</td><td>Results vary by connection speed and latency to each provider</td><td>Test from multiple locations; use aggregated results</td></tr>
              <tr><td>Sequential order bias</td><td>Later providers may benefit from warmed-up TCP connections</td><td>Run multiple times and compare averages</td></tr>
              <tr><td>Single-region testing</td><td>CDN performance varies by geography</td><td>Test from your users&apos; actual locations</td></tr>
              <tr><td>&quot;Ready&quot; definition variance</td><td>Providers define processing completion differently</td><td>We document each provider&apos;s readiness criteria</td></tr>
              <tr><td>ABR throttling vs real throttling</td><td>HLS.js bandwidth capping simulates but doesn&apos;t replicate real network jitter and packet loss</td><td>Results are indicative, not identical to real 3G</td></tr>
              <tr><td>10-second observation window</td><td>Longer videos may reveal different rebuffering patterns</td><td>Window is a tradeoff between accuracy and benchmark duration</td></tr>
            </tbody>
          </table>

          {/* ── Why Startup Latency Is the Most Important ── */}
          <h2>Why Startup Latency Is the Most Important Metric in 2026</h2>
          <p>
            Of all 7 metrics StreamBench measures, startup latency (TTFF) has the highest correlation with real-world viewer outcomes. Here&apos;s why:
          </p>

          <h3>1. Direct Impact on Abandonment</h3>
          <p>
            Every 1-second increase in startup time causes a <strong>5.8% increase in viewer abandonment</strong> (Akamai, 2024). For a platform serving 10 million daily video plays, going from 500 ms to 2 seconds costs approximately 870,000 lost viewers per day.
          </p>

          <h3>2. Engagement Depth Correlation</h3>
          <p>
            Videos that start within 500 ms have <strong>78% completion rates</strong>. Videos that take 2-3 seconds to start have <strong>38% completion rates</strong>. The startup experience sets the psychological frame for the entire viewing session — a fast start signals quality, a slow start triggers impatience.
          </p>

          <h3>3. Revenue Per Session</h3>
          <p>
            For ad-supported platforms, longer watch time directly equals more ad impressions. Conviva&apos;s 2025 analysis found that platforms with sub-500 ms startup generated <strong>23% higher ad completion rates</strong> than platforms averaging 2+ seconds. For subscription platforms, startup experience drives the &quot;perceived quality&quot; that influences renewal decisions.
          </p>

          <h3>4. Mobile-First Reality</h3>
          <p>
            With 72% of video consumption happening on mobile devices (Ericsson, 2025), startup latency is experienced under variable network conditions with higher baseline RTT. A provider that delivers 400 ms TTFF on broadband might deliver 2,000+ ms on 3G. The gap between providers that optimize for mobile-first and those that don&apos;t is measured in viewer retention percentage points.
          </p>

          <h3>5. Compounding Effect</h3>
          <p>
            Unlike bitrate — where differences below 20% are imperceptible — startup latency differences are always felt. A 300 ms improvement in TTFF is noticeable on every single play. Across millions of plays, this compounds into measurable improvements in engagement metrics, ad revenue, and user satisfaction scores.
          </p>

          <blockquote>
            <strong>Bottom line:</strong> If you can only optimize one metric, optimize startup latency. It has the highest leverage on viewer experience, engagement, and revenue of any single video infrastructure metric.
          </blockquote>

          {/* ── CTA ───────────────────────────────────────── */}
          <h2>Run Your Own Benchmark</h2>
          <p>
            StreamBench makes it easy to test these metrics with your own video files, from your own network, against the providers you&apos;re evaluating. Results are specific to your environment — which is exactly what matters for your decision.
          </p>
        </div>

        {/* Author section */}
        <div className="mt-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400 flex-shrink-0">
              KP
            </div>
            <div>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 transition-colors duration-150"
              >
                Kalyan Pilli
              </a>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                SDET &middot; Video Infrastructure Benchmarking
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <Link
            href="/benchmark"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-150"
          >
            Run a Benchmark
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
