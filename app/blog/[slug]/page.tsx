import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getPost, getAllSlugs } from "@/lib/blog";
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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Blog
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            <time>{post.date}</time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
            <span>&middot;</span>
            <span>{post.author}</span>
          </div>
        </div>

        <PostContent />
      </div>
    </div>
  );
}
