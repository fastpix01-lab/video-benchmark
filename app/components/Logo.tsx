import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 group">
      <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
        Stream
      </span>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent tracking-tight">
        Bench
      </span>
    </Link>
  );
}
