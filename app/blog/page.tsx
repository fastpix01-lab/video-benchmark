import type { Metadata } from "next";
import { posts } from "@/lib/blog";
import BlogCard from "@/app/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog — StreamBench",
  description: "Insights on video infrastructure performance, benchmarking methodology, and provider comparisons.",
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Blog
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10">
          Insights on video infrastructure, benchmarking, and provider comparisons.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
