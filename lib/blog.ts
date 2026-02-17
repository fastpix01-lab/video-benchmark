export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  author: string;
  category: string;
  gradient: string;
}

export const posts: BlogPost[] = [
  {
    slug: "six-provider-benchmark-2026",
    title: "2026 Video Infrastructure Benchmark: 6 Providers, 7 Metrics, One Clear Winner",
    date: "2026-02-10",
    excerpt:
      "We benchmarked Mux, FastPix, api.video, Cloudinary, Gumlet, and Vimeo across upload speed, processing time, startup latency, throttled performance, rebuffering, bitrate, and smoothness. Here are the full results.",
    readingTime: "12 min read",
    author: "Kalyan Pilli",
    category: "Benchmark",
    gradient: "from-blue-500 to-violet-600",
  },
  {
    slug: "startup-latency-most-important-metric",
    title: "Why Startup Latency Is the Most Important Video Metric in 2026",
    date: "2026-01-28",
    excerpt:
      "Startup latency directly drives viewer abandonment, engagement depth, and revenue per session. We analyze why TTFF now outweighs raw bitrate as the north-star metric for streaming teams.",
    readingTime: "9 min read",
    author: "Kalyan Pilli",
    category: "Research",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    slug: "network-throttling-impact-on-video-delivery",
    title: "How Network Throttling Exposes the Real Gaps Between Video Providers",
    date: "2026-01-15",
    excerpt:
      "Under ideal conditions, most providers look comparable. Throttle to 3G and the differences become dramatic. We tested all 6 providers under 2G, 3G, and 4G simulated conditions.",
    readingTime: "10 min read",
    author: "Kalyan Pilli",
    category: "Deep Dive",
    gradient: "from-orange-500 to-rose-600",
  },
  {
    slug: "fastpix-vs-mux-2026",
    title: "FastPix vs Mux in 2026: Upload, Processing, and Playback Benchmarked",
    date: "2026-01-02",
    excerpt:
      "An updated head-to-head comparison of FastPix and Mux across 7 metrics using real video files. We examine where each provider leads and where they fall short.",
    readingTime: "8 min read",
    author: "Kalyan Pilli",
    category: "Comparison",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    slug: "cloudinary-apivideo-gumlet-vimeo-compared",
    title: "Cloudinary vs api.video vs Gumlet vs Vimeo: Which Mid-Tier Provider Wins?",
    date: "2025-12-18",
    excerpt:
      "Not every team needs a premium video API. We benchmarked four mid-tier providers to find the best balance of performance, developer experience, and cost efficiency.",
    readingTime: "10 min read",
    author: "Kalyan Pilli",
    category: "Comparison",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    slug: "video-infrastructure-trends-2026",
    title: "5 Video Infrastructure Trends Reshaping Streaming in 2026",
    date: "2025-12-05",
    excerpt:
      "From edge-first delivery to sub-second startup and AV1 adoption, the video infrastructure landscape is shifting fast. We break down the 5 trends that matter most for engineering teams.",
    readingTime: "8 min read",
    author: "Kalyan Pilli",
    category: "Industry",
    gradient: "from-pink-500 to-rose-600",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}

export function getRelatedPosts(currentSlug: string, count = 2): BlogPost[] {
  return posts.filter((p) => p.slug !== currentSlug).slice(0, count);
}
