import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-zinc-300 dark:text-zinc-700 mb-4">404</p>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
