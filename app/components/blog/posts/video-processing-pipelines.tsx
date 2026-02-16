export default function VideoProcessingPipelines() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Understanding Video Processing Pipelines</h1>

      <p>
        When you upload a video to any streaming platform, a sophisticated pipeline transforms your raw file into
        adaptive bitrate streams ready for global delivery. Understanding this pipeline helps explain why processing
        times vary between providers.
      </p>

      <h2>Step 1: Ingest and Validation</h2>
      <p>
        The first step is receiving the uploaded file and validating it. Providers check the container format
        (MP4, MOV, MKV, etc.), codec compatibility, and file integrity. Some providers accept a wider range of
        input formats than others, which can affect upload flexibility.
      </p>

      <h2>Step 2: Transcoding</h2>
      <p>
        Transcoding is the most compute-intensive step. The provider decodes the source video and re-encodes it
        into multiple renditions at different resolutions and bitrates. A typical ladder might include:
      </p>
      <ul>
        <li>360p at 800 kbps</li>
        <li>480p at 1.4 Mbps</li>
        <li>720p at 2.8 Mbps</li>
        <li>1080p at 5 Mbps</li>
      </ul>
      <p>
        Most providers use H.264 as the primary codec for broad compatibility. Some also generate H.265/HEVC
        or AV1 renditions for better compression on supported devices.
      </p>

      <h2>Step 3: Packaging</h2>
      <p>
        After transcoding, the renditions are segmented and packaged into streaming formats. HLS
        (HTTP Live Streaming) is the most common format, using MPEG-TS or fMP4 segments with an M3U8 manifest.
        Some providers also generate DASH manifests for broader compatibility.
      </p>
      <p>
        Each rendition is split into small segments (typically 2-10 seconds each), and a master manifest is
        created that references all available quality levels. The player uses this manifest to switch between
        qualities based on network conditions.
      </p>

      <h2>Step 4: CDN Distribution</h2>
      <p>
        The packaged segments and manifests are distributed to CDN edge nodes worldwide. This ensures that
        viewers get served from the nearest point of presence, minimizing latency. The speed of CDN propagation
        affects how quickly a video becomes playable after processing completes.
      </p>

      <h2>Why Processing Times Differ</h2>
      <p>
        Provider processing speeds depend on several factors:
      </p>
      <ul>
        <li><strong>Hardware</strong> — GPU-accelerated transcoding vs CPU-only</li>
        <li><strong>Parallelism</strong> — How many renditions are encoded simultaneously</li>
        <li><strong>Pipeline architecture</strong> — Whether processing starts immediately or is queued</li>
        <li><strong>Quality targets</strong> — More renditions and higher quality settings take longer</li>
        <li><strong>&quot;Ready&quot; definition</strong> — Some providers report &quot;ready&quot; when the lowest quality is done, others wait for all renditions</li>
      </ul>
    </article>
  );
}
