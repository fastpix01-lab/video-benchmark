export default function CloudinaryApiVideoGumletVimeoCompared() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>Cloudinary vs api.video vs Gumlet vs Vimeo: Which Mid-Tier Provider Wins?</h1>

      <blockquote>
        <strong>Executive Summary:</strong> Not every product needs a premium video API like Mux or FastPix. We benchmarked four providers that occupy the mid-tier of the video infrastructure market: Cloudinary, api.video, Gumlet, and Vimeo. api.video posted the best overall results — fastest processing, lowest startup latency, and the most stable throttled performance. Gumlet offered competitive performance at a lower price point. Cloudinary traded speed for media pipeline unification. Vimeo showed the weakest raw performance but brings brand trust and ecosystem breadth.
      </blockquote>

      <h2>Who Are These Providers For?</h2>
      <p>
        The &quot;mid-tier&quot; label isn&apos;t about quality — it&apos;s about specialization. Mux and FastPix are API-first, video-only platforms. The four providers in this comparison serve broader use cases:
      </p>
      <ul>
        <li><strong>Cloudinary</strong> — A unified media management platform handling images, video, and documents. Video is one capability among many.</li>
        <li><strong>api.video</strong> — A purpose-built video API that competes directly with Mux and FastPix but positions itself as more developer-friendly and cost-effective.</li>
        <li><strong>Gumlet</strong> — Originally an image optimization platform that expanded into video. Offers competitive pricing and decent performance.</li>
        <li><strong>Vimeo</strong> — The legacy video platform that now offers OTT and enterprise video APIs. Strongest brand recognition in the group.</li>
      </ul>
      <p>
        Choosing between these providers often comes down to existing infrastructure, pricing, and which secondary capabilities you need alongside video processing.
      </p>

      <h2>Core Performance Metrics</h2>
      <p>
        Averaged across three test files (15 MB, 50 MB, 200 MB), 5 runs each:
      </p>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Upload (ms)</th>
            <th>Processing (ms)</th>
            <th>TTFF (ms)</th>
            <th>Total E2E (s)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>api.video</strong></td><td>5,640</td><td>42,100</td><td>520</td><td>48.3</td></tr>
          <tr><td>Gumlet</td><td>5,900</td><td>45,800</td><td>560</td><td>52.3</td></tr>
          <tr><td>Vimeo</td><td>5,300</td><td>52,600</td><td>710</td><td>58.6</td></tr>
          <tr><td>Cloudinary</td><td>6,100</td><td>58,200</td><td>680</td><td>65.0</td></tr>
        </tbody>
      </table>

      <p>
        <strong>Analysis:</strong> api.video leads on both processing time and startup latency — a strong result that positions it as the performance leader among mid-tier providers. Vimeo&apos;s slightly faster upload (5,300 ms) likely reflects its large CDN footprint, but this advantage is negated by its slower processing pipeline. Cloudinary trails on processing, consistent with its general-purpose architecture that handles video through its broader media transformation engine.
      </p>

      <h2>Upload Workflow Comparison</h2>
      <p>
        How each provider handles uploads impacts both developer experience and upload timing:
      </p>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Upload Method</th>
            <th>CORS Status</th>
            <th>Auth Approach</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>api.video</td><td>Create container, then upload source</td><td>Requires proxy</td><td>API key in header</td></tr>
          <tr><td>Gumlet</td><td>Signed URL, then raw PUT</td><td>Requires proxy</td><td>Signed URL token</td></tr>
          <tr><td>Vimeo</td><td>TUS resumable upload</td><td>Requires proxy</td><td>OAuth bearer token</td></tr>
          <tr><td>Cloudinary</td><td>Form-data with signed params</td><td>Direct (no proxy needed)</td><td>Signature + API key in form</td></tr>
        </tbody>
      </table>

      <p>
        Cloudinary is the only provider in this group that supports direct browser-to-provider uploads without a proxy. This simplifies the upload architecture but requires exposing upload parameters (including a computed signature) in client-side code. The other three require a backend proxy to relay uploads, which adds 100-300 ms of latency depending on server location.
      </p>

      <h2>Advanced Metrics Under 3G Throttling</h2>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>3G TTFF</th>
            <th>Rebuffers</th>
            <th>Rebuffer Ratio</th>
            <th>Avg Bitrate (Kbps)</th>
            <th>Smoothness</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>api.video</strong></td><td>2,040 ms</td><td>1</td><td>0.045</td><td>540</td><td>75</td></tr>
          <tr><td>Gumlet</td><td>2,210 ms</td><td>1</td><td>0.051</td><td>510</td><td>70</td></tr>
          <tr><td>Vimeo</td><td>2,640 ms</td><td>2</td><td>0.112</td><td>490</td><td>50</td></tr>
          <tr><td>Cloudinary</td><td>2,890 ms</td><td>2</td><td>0.098</td><td>460</td><td>55</td></tr>
        </tbody>
      </table>

      <p>
        api.video and Gumlet performed similarly under 3G, with api.video holding a slight edge on TTFF and bitrate. Both had single rebuffer events. Vimeo and Cloudinary each exhibited two rebuffer events during the 10-second observation window, pushing their smoothness scores into the &quot;degraded&quot; category (below 60).
      </p>
      <p>
        For context: FastPix scored 95 and Mux scored 80 on the same test. The mid-tier group ranges from 50-75, which confirms that purpose-built video APIs have a structural advantage on playback quality under constrained conditions.
      </p>

      <h2>Processing Pipeline Architecture</h2>
      <p>
        Understanding why processing times differ:
      </p>
      <ul>
        <li>
          <strong>api.video</strong> processes to multiple quality levels and reports &quot;ready&quot; when the lowest quality rendition is complete. This gives it a head start on the readiness clock and benefits startup latency, since the lowest-quality segment is immediately available for fast first-frame delivery.
        </li>
        <li>
          <strong>Gumlet</strong> uses an ABR pipeline that produces multiple renditions in parallel. Processing times are competitive for shorter clips but scale less linearly on longer content (5+ minutes).
        </li>
        <li>
          <strong>Vimeo</strong> has a mature processing pipeline built for its creator platform. It generates more renditions than most API-first providers (including multiple audio tracks and subtitle-ready formats), which explains the longer processing time.
        </li>
        <li>
          <strong>Cloudinary</strong> routes video through its media transformation engine, which adds overhead from format detection, metadata extraction, and transformation graph evaluation before transcoding begins. The actual encoding speed is competitive, but the pipeline setup cost is visible in the numbers.
        </li>
      </ul>

      <h2>Pricing and Value Positioning</h2>
      <p>
        While we don&apos;t benchmark pricing directly (it varies by contract and volume), the market positioning of each provider matters for purchasing decisions:
      </p>
      <ul>
        <li><strong>api.video</strong> — Transparent per-minute encoding and streaming pricing. Competitive for low-to-medium volume.</li>
        <li><strong>Gumlet</strong> — Aggressive pricing, especially for teams already using Gumlet for image optimization. Best value per dollar in this group.</li>
        <li><strong>Vimeo</strong> — Tiered plans with storage and bandwidth limits. The Pro/Business plans include hosting, analytics, and player customization bundled in.</li>
        <li><strong>Cloudinary</strong> — Credit-based pricing across all media types. Video credits cost more per transformation than image credits, which can surprise teams scaling video operations.</li>
      </ul>

      <h2>When to Choose Each</h2>
      <ul>
        <li><strong>api.video</strong> — Best pure-video option in this group. Choose it when you need clean APIs, competitive performance, and don&apos;t require bundled hosting or media management beyond video.</li>
        <li><strong>Gumlet</strong> — Best value play. Choose it when you&apos;re cost-sensitive, already use Gumlet for images, or need a solid mid-range performer without the premium price tag.</li>
        <li><strong>Cloudinary</strong> — Best when you already use Cloudinary for images and want a single media pipeline. Accept the processing speed tradeoff in exchange for operational simplicity.</li>
        <li><strong>Vimeo</strong> — Best when you need brand credibility, built-in video hosting, or OTT/enterprise features (access controls, domains, analytics) bundled into the platform. Accept the performance tradeoff.</li>
      </ul>

      <h2>Key Takeaways</h2>
      <ul>
        <li><strong>api.video is the performance leader</strong> among mid-tier providers, posting results that approach Mux-level performance on most metrics.</li>
        <li><strong>Gumlet offers the best performance-per-dollar</strong> ratio, with results 5-10% behind api.video across all metrics.</li>
        <li><strong>Cloudinary and Vimeo trade performance for breadth.</strong> Their slower numbers reflect platforms optimized for broader media capabilities, not just video speed.</li>
        <li><strong>All four providers exceed 2-second TTFF under 3G.</strong> For mobile-first or emerging-market applications, the premium providers (FastPix, Mux) offer a meaningful advantage.</li>
        <li><strong>Proxy uploads add measurable latency.</strong> Three of four providers in this group require proxy uploads, which adds 100-300 ms. Factor this into your architecture decisions.</li>
      </ul>
    </article>
  );
}
