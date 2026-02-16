import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

export default function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 hover:-translate-y-0.5"
      >
        {/* Gradient cover */}
        <div className={`h-48 sm:h-56 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
          <div className="absolute bottom-4 left-5">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
              {post.category}
            </span>
          </div>
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            <time>{post.date}</time>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span>{post.readingTime}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <span>{post.author}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-3">
            {post.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 gap-1.5 transition-all duration-200">
            Read article
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 hover:-translate-y-0.5"
    >
      {/* Gradient cover */}
      <div className={`h-32 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
        <div className="absolute bottom-3 left-4">
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
            {post.category}
          </span>
        </div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2.5">
          <time>{post.date}</time>
          <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span>{post.readingTime}</span>
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{post.author}</span>
          <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
