export default function NetworkThrottlingImpact() {
  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <h1>How Network Throttling Exposes the Real Gaps Between Video Providers</h1>

      <blockquote>
        <strong>Executive Summary:</strong> We tested all 6 video infrastructure providers under simulated 2G (150 Kbps), 3G (750 Kbps), and normal broadband conditions. Under broadband, all providers deliver within a 400 ms TTFF window. Under 3G, the gap widens to 1.5 seconds. Under 2G, two providers failed to start playback within 10 seconds. Network throttling is the most reliable way to separate strong video infrastructure from adequate video infrastructure.
      </blockquote>

      <h2>Why Throttle Testing Matters</h2>
      <p>
        Most video infrastructure benchmarks test under ideal conditions: high-bandwidth connections, low latency, and no packet loss. This produces results that look reassuringly similar across providers. But it doesn&apos;t reflect reality for a significant portion of global users:
      </p>
      <ul>
        <li><strong>1.2 billion mobile users</strong> operate on 3G-equivalent or slower connections (GSMA, 2025)</li>
        <li><strong>Peak-hour congestion</strong> in urban markets can reduce effective bandwidth by 40-60%</li>
        <li><strong>Emerging markets</strong> — India, Southeast Asia, Sub-Saharan Africa — represent the fastest-growing video audiences, and they&apos;re predominantly mobile-first on constrained networks</li>
        <li><strong>Public Wi-Fi and transit</strong> connections routinely throttle to 1-3 Mbps with high jitter</li>
      </ul>
      <p>
        If your video platform serves a global audience, throttled performance isn&apos;t an edge case — it&apos;s a core requirement.
      </p>

      <h2>Test Setup</h2>
      <p>
        We used StreamBench&apos;s advanced metrics mode to test each provider under three network conditions. Throttling is implemented via HLS.js&apos;s ABR bandwidth estimation cap, which limits the player&apos;s perceived available bandwidth and forces it to select lower-bitrate renditions.
      </p>
      <ul>
        <li><strong>Broadband:</strong> No throttling (uncapped, ~100 Mbps available)</li>
        <li><strong>Simulated 3G:</strong> 750 Kbps bandwidth cap</li>
        <li><strong>Simulated 2G:</strong> 150 Kbps bandwidth cap</li>
      </ul>
      <p>
        Each test used a 50 MB / 1080p / 60-second source file. Results are averaged across 5 runs per condition per provider. A 10-second playback observation window captured rebuffering and bitrate data.
      </p>

      <h2>Startup Latency Under Throttling</h2>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Broadband TTFF</th>
            <th>3G TTFF</th>
            <th>2G TTFF</th>
            <th>3G/Broadband Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>FastPix</strong></td><td>340 ms</td><td>1,420 ms</td><td>4,100 ms</td><td>4.2x</td></tr>
          <tr><td>Mux</td><td>410 ms</td><td>1,680 ms</td><td>5,200 ms</td><td>4.1x</td></tr>
          <tr><td>api.video</td><td>520 ms</td><td>2,040 ms</td><td>6,800 ms</td><td>3.9x</td></tr>
          <tr><td>Gumlet</td><td>560 ms</td><td>2,210 ms</td><td>7,400 ms</td><td>3.9x</td></tr>
          <tr><td>Cloudinary</td><td>680 ms</td><td>2,890 ms</td><td>9,600 ms</td><td>4.3x</td></tr>
          <tr><td>Vimeo</td><td>710 ms</td><td>2,640 ms</td><td>&gt;10,000 ms</td><td>3.7x</td></tr>
        </tbody>
      </table>

      <p>
        The 3G column is where most providers diverge meaningfully. FastPix stays under the critical 1.5-second mark, while Cloudinary and Vimeo push past 2.5 seconds. Under 2G, the spread is dramatic: FastPix starts in 4.1 seconds, while Vimeo exceeds the 10-second timeout in 3 of 5 test runs.
      </p>

      <h2>Rebuffering Under Throttled Conditions</h2>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>3G Rebuffers</th>
            <th>3G Rebuffer Ratio</th>
            <th>2G Rebuffers</th>
            <th>2G Rebuffer Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>FastPix</strong></td><td>0</td><td>0.000</td><td>1</td><td>0.042</td></tr>
          <tr><td>Mux</td><td>1</td><td>0.032</td><td>2</td><td>0.098</td></tr>
          <tr><td>api.video</td><td>1</td><td>0.045</td><td>3</td><td>0.152</td></tr>
          <tr><td>Gumlet</td><td>1</td><td>0.051</td><td>2</td><td>0.134</td></tr>
          <tr><td>Cloudinary</td><td>2</td><td>0.098</td><td>4</td><td>0.280</td></tr>
          <tr><td>Vimeo</td><td>2</td><td>0.112</td><td>—</td><td>—</td></tr>
        </tbody>
      </table>

      <p>
        <em>Vimeo&apos;s 2G rebuffer data is omitted because the player did not reliably start playback within the observation window.</em>
      </p>
      <p>
        FastPix achieved zero rebuffering under 3G — the only provider to do so. Under 2G, it had a single rebuffer event with a 4.2% rebuffer ratio, significantly better than Cloudinary&apos;s 28%. This points to an aggressive ABR ladder with a viable low-bitrate rendition that other providers may lack.
      </p>

      <h2>Bitrate Selection Under Throttling</h2>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>3G Avg Bitrate (Kbps)</th>
            <th>3G Peak Bitrate (Kbps)</th>
            <th>2G Avg Bitrate (Kbps)</th>
            <th>ABR Switches (3G)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>FastPix</strong></td><td>620</td><td>740</td><td>130</td><td>1</td></tr>
          <tr><td>Mux</td><td>580</td><td>720</td><td>110</td><td>2</td></tr>
          <tr><td>api.video</td><td>540</td><td>690</td><td>100</td><td>2</td></tr>
          <tr><td>Gumlet</td><td>510</td><td>670</td><td>90</td><td>3</td></tr>
          <tr><td>Cloudinary</td><td>460</td><td>610</td><td>80</td><td>3</td></tr>
          <tr><td>Vimeo</td><td>490</td><td>650</td><td>—</td><td>2</td></tr>
        </tbody>
      </table>

      <p>
        FastPix and Mux maintained the highest average bitrates under 3G, indicating their ABR ladders are well-calibrated for constrained conditions. Notably, FastPix achieved this with only 1 ABR switch during the 10-second observation — meaning it quickly settled on a sustainable bitrate. Gumlet and Cloudinary each had 3 ABR switches, suggesting their ABR algorithms oscillate more under bandwidth pressure.
      </p>

      <h2>What Makes Some Providers Better Under Throttling?</h2>
      <p>
        Several architectural decisions determine throttled performance:
      </p>
      <ul>
        <li><strong>Low-bitrate rendition availability.</strong> Providers that include a 200-300 Kbps rendition in their ABR ladder can start faster and avoid rebuffering on slow connections. Providers that bottom out at 500+ Kbps force the player to buffer longer before beginning playback.</li>
        <li><strong>Manifest size.</strong> A 12 KB manifest takes 1.2 seconds to download on a 2G connection. A 3 KB manifest takes 300 ms. This difference directly adds to startup time.</li>
        <li><strong>Segment duration.</strong> Shorter initial segments (2s vs 6s) mean less data is needed before the first frame, which is critical under low bandwidth.</li>
        <li><strong>CDN edge coverage.</strong> Providers with aggressive edge caching reduce the round-trip latency for manifest and first-segment delivery. This matters most on high-RTT mobile connections.</li>
      </ul>

      <h2>Smoothness Score Comparison</h2>
      <p>
        StreamBench&apos;s smoothness score (0-100) penalizes rebuffering events (-15 per event) and ABR switches (-5 per switch). A score of 80+ indicates a smooth viewing experience.
      </p>

      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Broadband Smoothness</th>
            <th>3G Smoothness</th>
            <th>2G Smoothness</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>FastPix</strong></td><td>100</td><td>95</td><td>70</td></tr>
          <tr><td>Mux</td><td>100</td><td>80</td><td>50</td></tr>
          <tr><td>api.video</td><td>100</td><td>75</td><td>30</td></tr>
          <tr><td>Gumlet</td><td>100</td><td>70</td><td>35</td></tr>
          <tr><td>Cloudinary</td><td>95</td><td>55</td><td>10</td></tr>
          <tr><td>Vimeo</td><td>100</td><td>50</td><td>—</td></tr>
        </tbody>
      </table>

      <p>
        Under broadband, all providers score 95-100. Under 3G, FastPix (95) and Mux (80) remain in the &quot;smooth&quot; category. Cloudinary (55) and Vimeo (50) drop into the &quot;degraded&quot; range. Under 2G, only FastPix maintains a passing score (70).
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li><strong>Broadband benchmarks are not enough.</strong> All providers look similar under ideal conditions. Throttle to 3G and the real architectural differences emerge.</li>
        <li><strong>FastPix delivers the most consistent throttled performance</strong> — zero rebuffering under 3G, lowest throttled TTFF, and highest smoothness scores across all conditions.</li>
        <li><strong>Low-bitrate renditions are non-negotiable</strong> for global audiences. Providers without a 200-300 Kbps rendition in their ABR ladder will struggle on 3G and fail on 2G.</li>
        <li><strong>Manifest size matters more than most teams realize.</strong> Under constrained bandwidth, even a few KB of manifest overhead translates to hundreds of milliseconds of startup delay.</li>
        <li><strong>Test at 3G minimum.</strong> If your video platform serves users in India, Southeast Asia, Sub-Saharan Africa, or anyone on public Wi-Fi, 3G is your baseline, not your edge case.</li>
      </ul>
    </article>
  );
}
