import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPost, getAllSlugs, getRelatedPosts } from "@/lib/blog";
import BlogCard from "@/app/components/blog/BlogCard";
import ScrollProgress from "@/app/components/blog/ScrollProgress";
import { LINKEDIN_URL } from "@/app/components/AuthorLink";
import FastPixVsMux from "@/app/components/blog/posts/fastpix-vs-mux";
import StartupTimeMatters from "@/app/components/blog/posts/startup-time-matters";
import CloudinaryApiVideoGumlet from "@/app/components/blog/posts/cloudinary-apivideo-gumlet";
import VideoProcessingPipelines from "@/app/components/blog/posts/video-processing-pipelines";
import MeasuringVideoPerformance from "@/app/components/blog/posts/measuring-video-performance";

const POST_COMPONENTS: Record<string, React.ComponentType> = {
  "fastpix-vs-mux": FastPixVsMux,
  "startup-time-matters": StartupTimeMatters,
  "cloudinary-apivideo-gumlet": CloudinaryApiVideoGumlet,
  "video-processing-pipelines": VideoProcessingPipelines,
  "measuring-video-performance": MeasuringVideoPerformance,
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not Found — StreamBench" };
  return {
    title: `${post.title} — StreamBench`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const PostContent = POST_COMPONENTS[slug];
  if (!PostContent) notFound();

  const related = getRelatedPosts(slug, 2);

  return (
    <>
      <ScrollProgress />

      <div className="min-h-screen">
        {/* Hero */}
        <div className={`relative bg-gradient-to-br ${post.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-16 pb-20">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-white/70 hover:text-white mb-8 transition-colors duration-150 group"
            >
              <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Blog
            </Link>

            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm mb-5">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-3 text-sm text-white/60">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                KP
              </div>
              <div>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 font-medium hover:text-white hover:underline underline-offset-2 transition-colors duration-150"
                >
                  {post.author}
                </a>
                <p className="text-white/60 text-xs">
                  SDET &middot; Video Infrastructure Benchmarking
                </p>
                <p className="mt-0.5">
                  <time>{post.date}</time>
                  <span className="mx-1.5">&middot;</span>
                  <span>{post.readingTime}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:not-italic prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-img:rounded-xl">
            <PostContent />
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                Continue Reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
