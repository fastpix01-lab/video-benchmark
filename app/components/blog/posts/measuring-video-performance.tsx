export default function MeasuringVideoPerformance() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>How We Measure Video Infrastructure Performance</h1>

      <p>
        StreamBench measures three key metrics for each video infrastructure provider: upload time, processing time,
        and startup time (time-to-first-frame). Here&apos;s our detailed methodology.
      </p>

      <h2>Upload Time Measurement</h2>
      <p>
        Upload time measures the duration from initiating the upload to receiving confirmation that the file
        has been received by the provider. The measurement includes:
      </p>
      <ul>
        <li>Creating the upload session (getting a signed URL or upload token)</li>
        <li>Transferring the file data to the provider</li>
        <li>Receiving the upload completion response</li>
      </ul>
      <p>
        For providers that require proxy uploads (due to CORS restrictions), the time includes the round-trip
        through our backend server. For direct uploads, the file goes straight from the browser to the provider.
        FastPix uses their resumable uploads SDK which chunks the file into 16 MB segments.
      </p>

      <h2>Processing Time Measurement</h2>
      <p>
        Processing time is measured by polling the provider&apos;s status API at 3-second intervals until the video
        is reported as &quot;ready&quot; for playback. The measurement starts immediately after upload completion and
        ends when the provider returns a playback URL.
      </p>
      <p>
        We use a 5-minute timeout. If processing hasn&apos;t completed within that window, the benchmark records a failure.
        This timeout is generous — most providers complete processing well within 2-3 minutes for standard-length videos.
      </p>

      <h2>Startup Time (TTFF) Measurement</h2>
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
        and video decode time. The video element is muted to avoid autoplay restrictions.
      </p>

      <h2>Retry Logic</h2>
      <p>
        Each provider gets up to 2 retries (3 total attempts) if an error occurs during any phase. This handles
        transient network issues and temporary provider errors. Only the final attempt&apos;s metrics are recorded
        — if all attempts fail, the provider is marked as failed with the last error message.
      </p>

      <h2>Fairness Considerations</h2>
      <p>
        All providers are benchmarked sequentially with the same file. While this means later providers might
        benefit from warmed-up network connections, the sequential approach prevents bandwidth competition
        between simultaneous uploads. For the most reliable results, we recommend running the benchmark
        multiple times with multiple files and comparing the aggregated averages.
      </p>
    </article>
  );
}
