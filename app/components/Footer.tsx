import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <Logo />
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
              Independent infrastructure benchmarking for video streaming platforms.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/benchmark", label: "Run Benchmark" },
                { href: "/methodology", label: "Methodology" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Providers */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Providers Tested
            </h3>
            <ul className="space-y-2">
              {["Mux", "FastPix", "api.video", "Cloudinary", "Gumlet"].map((name) => (
                <li key={name} className="text-sm text-zinc-500 dark:text-zinc-400">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
            StreamBench — Open-source video infrastructure benchmarking
          </p>
        </div>
      </div>
    </footer>
  );
}
