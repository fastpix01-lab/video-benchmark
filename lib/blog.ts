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
    slug: "fastpix-vs-mux",
    title: "FastPix vs Mux: Real-World Upload Benchmark",
    date: "2025-12-15",
    excerpt:
      "We compared FastPix and Mux head-to-head across upload speed, processing time, and startup latency. Here are the results.",
    readingTime: "5 min read",
    author: "Kalyan Pilli",
    category: "Benchmark",
    gradient: "from-blue-500 to-violet-600",
  },
  {
    slug: "startup-time-matters",
    title: "Why Startup Time Matters in Video Streaming",
    date: "2025-12-10",
    excerpt:
      "Startup time directly impacts viewer retention. Studies show every 1-second increase in buffering causes a 6% drop in watch time.",
    readingTime: "4 min read",
    author: "Kalyan Pilli",
    category: "Research",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    slug: "cloudinary-apivideo-gumlet",
    title: "Cloudinary vs api.video vs Gumlet Comparison",
    date: "2025-12-05",
    excerpt:
      "A three-way comparison of Cloudinary, api.video, and Gumlet — examining upload workflows, processing speeds, and HLS delivery.",
    readingTime: "6 min read",
    author: "Kalyan Pilli",
    category: "Comparison",
    gradient: "from-orange-500 to-rose-600",
  },
  {
    slug: "video-processing-pipelines",
    title: "Understanding Video Processing Pipelines",
    date: "2025-11-28",
    excerpt:
      "What happens after you upload a video? We break down the transcoding, packaging, and CDN delivery steps that every provider performs.",
    readingTime: "7 min read",
    author: "Kalyan Pilli",
    category: "Deep Dive",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    slug: "measuring-video-performance",
    title: "How We Measure Video Infrastructure Performance",
    date: "2025-11-20",
    excerpt:
      "Our benchmarking methodology: how we measure upload time, processing time, and time-to-first-frame across providers.",
    readingTime: "5 min read",
    author: "Kalyan Pilli",
    category: "Methodology",
    gradient: "from-cyan-500 to-blue-600",
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
