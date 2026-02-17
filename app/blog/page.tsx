import type { Metadata } from "next";
import { posts } from "@/lib/blog";
import BlogCard from "@/app/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog — StreamBench",
  description: "Insights on video infrastructure performance, benchmarking methodology, and provider comparisons.",
};

export default function BlogIndexPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3 tracking-wide uppercase">
            Blog
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Insights &amp; Benchmarks
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl">
            Deep dives into video infrastructure performance, provider comparisons, and the metrics that matter.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* Featured article */}
        <section className="mb-12">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
            Featured
          </p>
          <BlogCard post={featured} featured />
        </section>

        {/* Article grid */}
        <section>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
            All Articles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
