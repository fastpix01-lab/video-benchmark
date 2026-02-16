export default function CloudinaryApiVideoGumlet() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Cloudinary vs api.video vs Gumlet Comparison</h1>

      <p>
        Beyond the well-known players like Mux and FastPix, three other providers offer compelling video infrastructure:
        Cloudinary, api.video, and Gumlet. We benchmarked all three to understand their strengths and tradeoffs.
      </p>

      <h2>Upload Workflow Differences</h2>
      <p>
        Each provider handles uploads differently, which impacts both developer experience and performance:
      </p>
      <ul>
        <li>
          <strong>Cloudinary</strong> uses form-data uploads with signed parameters. The upload URL, API key,
          timestamp, and signature are included in the form. This means uploads go directly to Cloudinary&apos;s
          API without CORS issues.
        </li>
        <li>
          <strong>api.video</strong> requires a two-step process: first create a video container, then upload
          the source file. Due to CORS restrictions, uploads must be proxied through your backend.
        </li>
        <li>
          <strong>Gumlet</strong> creates a signed upload URL via their API, then accepts a raw PUT upload.
          Like api.video, CORS restrictions require proxy uploads for browser-based tools.
        </li>
      </ul>

      <h2>Processing Architecture</h2>
      <p>
        Cloudinary&apos;s video processing is built on top of their image transformation pipeline. When you request
        HLS output (via the <code>sp_auto</code> streaming profile), Cloudinary transcodes to multiple bitrates
        and generates an HLS manifest. This can take longer than dedicated video platforms.
      </p>
      <p>
        api.video is purpose-built for video and typically processes faster. Their encoding pipeline generates
        multiple quality levels and provides a playback URL once the lowest quality is ready.
      </p>
      <p>
        Gumlet uses an ABR (Adaptive Bitrate) format that produces multiple renditions. Their processing times
        are competitive, particularly for shorter videos.
      </p>

      <h2>Delivery and Playback</h2>
      <p>
        All three providers deliver via HLS, but their CDN strategies differ. Cloudinary leverages their global
        CDN (which also serves images and other assets). api.video has a dedicated video CDN optimized for
        streaming. Gumlet uses a multi-CDN approach for delivery.
      </p>

      <h2>When to Choose Each</h2>
      <ul>
        <li><strong>Cloudinary</strong> — Best if you already use Cloudinary for images and want a unified media pipeline</li>
        <li><strong>api.video</strong> — Best for video-first applications that need fast processing and a clean API</li>
        <li><strong>Gumlet</strong> — Best for teams looking for competitive pricing with solid performance</li>
      </ul>
    </article>
  );
}
