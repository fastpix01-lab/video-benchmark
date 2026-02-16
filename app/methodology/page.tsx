import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology — StreamBench",
  description: "How StreamBench measures video infrastructure performance across providers.",
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Methodology
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-12">
          How we measure video infrastructure performance
        </p>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>Overview</h2>
          <p>
            StreamBench measures three key metrics for each video infrastructure provider: upload time,
            processing time, and startup time (time-to-first-frame). Each provider is benchmarked sequentially
            with the same file to ensure fair comparison.
          </p>

          <h2>Upload Time</h2>
          <p>
            Upload time measures the full duration from initiating the upload request to receiving confirmation
            that the file has been received. This includes:
          </p>
          <ul>
            <li>Creating the upload session (signed URL or upload token)</li>
            <li>Transferring the file data to the provider</li>
            <li>Receiving the completion response</li>
          </ul>
          <p>
            Providers that require proxy uploads (api.video, Gumlet) route through our backend to handle CORS
            restrictions. This adds some latency compared to direct uploads but reflects the real-world setup
            many applications use.
          </p>
          <p>
            FastPix uses their resumable uploads SDK, which splits files into 16 MB chunks. Mux and Cloudinary
            support direct browser-to-provider uploads.
          </p>

          <h2>Processing Time</h2>
          <p>
            Processing time is measured by polling the provider&apos;s status API at 3-second intervals until the
            video is reported as ready for playback. The clock starts immediately after upload completion and
            stops when the provider returns a playback URL.
          </p>
          <p>
            A 5-minute timeout is enforced. If processing hasn&apos;t completed within that window, the benchmark
            records a failure. Most providers complete processing well within 2-3 minutes for standard-length
            videos.
          </p>

          <h2>Startup Time (TTFF)</h2>
          <p>
            Time-to-first-frame (TTFF) is the most user-facing metric. We measure it using hls.js in the browser:
          </p>
          <ol>
            <li>Load the HLS manifest URL into an hls.js instance</li>
            <li>Wait for the <code>MANIFEST_PARSED</code> event</li>
            <li>Call <code>video.play()</code> and start the timer</li>
            <li>Listen for the <code>playing</code> event to stop the timer</li>
          </ol>
          <p>
            This captures the real-world playback experience including manifest download, first segment download,
            and video decode time.
          </p>

          <h2>Test Conditions</h2>
          <ul>
            <li>All providers are tested sequentially with the same file</li>
            <li>Each provider gets up to 2 retries (3 total attempts) for transient errors</li>
            <li>The video element is muted to avoid autoplay restrictions</li>
            <li>Results can be aggregated across multiple files for more reliable averages</li>
          </ul>

          <h2>Limitations</h2>
          <ul>
            <li>
              <strong>Network dependency</strong> — Results are influenced by your network connection speed
              and latency to each provider&apos;s servers.
            </li>
            <li>
              <strong>Sequential testing</strong> — Providers tested later may benefit from warmed-up network
              connections, though this effect is typically small.
            </li>
            <li>
              <strong>Proxy overhead</strong> — Providers requiring proxy uploads (api.video, Gumlet) include
              the round-trip through the backend server in their upload time.
            </li>
            <li>
              <strong>Single-region</strong> — Benchmarks are run from a single location; results may vary
              from different geographic regions.
            </li>
            <li>
              <strong>&quot;Ready&quot; definition</strong> — Different providers may define &quot;ready&quot; differently: some
              report ready when the lowest quality is available, others wait for all renditions.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
