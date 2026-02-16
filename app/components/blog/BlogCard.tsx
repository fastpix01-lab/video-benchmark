import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors group"
    >
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
        <time>{post.date}</time>
        <span>&middot;</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
        {post.title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
        {post.excerpt}
      </p>
    </Link>
  );
}
