export default function StartupTimeMatters() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Why Startup Time Matters in Video Streaming</h1>

      <p>
        In the world of video streaming, first impressions happen in milliseconds. Startup time — the duration between
        a user clicking play and seeing the first frame of video — is one of the most critical metrics for viewer experience.
      </p>

      <h2>The Impact on Viewer Retention</h2>
      <p>
        Research from Akamai and other CDN providers consistently shows that startup delays directly correlate with
        viewer abandonment. Key findings include:
      </p>
      <ul>
        <li>A 1-second increase in startup time can cause a 5.8% increase in abandonment rate</li>
        <li>Videos that start within 2 seconds have 70% higher completion rates</li>
        <li>Mobile users are even less tolerant of delays than desktop users</li>
      </ul>

      <h2>What Affects Startup Time?</h2>
      <p>
        Startup time is composed of several sequential operations:
      </p>
      <ol>
        <li><strong>DNS resolution</strong> — Resolving the CDN hostname (typically 10-50ms)</li>
        <li><strong>TLS handshake</strong> — Establishing a secure connection (50-150ms)</li>
        <li><strong>Manifest fetch</strong> — Downloading the HLS/DASH manifest file (50-200ms)</li>
        <li><strong>Segment fetch</strong> — Downloading the first video segment (100-500ms)</li>
        <li><strong>Decode and render</strong> — Decoding video data and painting the first frame (50-200ms)</li>
      </ol>

      <h2>How Providers Optimize</h2>
      <p>
        Video infrastructure providers use several strategies to minimize startup time:
      </p>
      <ul>
        <li><strong>Edge caching</strong> — Distributing content to CDN edge nodes close to viewers</li>
        <li><strong>Preloading</strong> — Starting manifest and segment downloads before the user clicks play</li>
        <li><strong>Low-latency manifests</strong> — Generating compact HLS manifests with minimal overhead</li>
        <li><strong>First-segment optimization</strong> — Ensuring the initial segment is small enough for quick download</li>
      </ul>

      <h2>Measuring with StreamBench</h2>
      <p>
        StreamBench measures time-to-first-frame (TTFF) by loading an HLS manifest with hls.js and timing from
        manifest parse completion to the first video frame rendering. This gives a realistic measurement of what
        viewers actually experience, including CDN latency and decode time.
      </p>
    </article>
  );
}
