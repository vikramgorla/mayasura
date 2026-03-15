import Link from "next/link";
import { Github } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Templates", href: "/templates" },
  { label: "Create a Brand", href: "/create" },
  { label: "Design Studio", href: "/dashboard" },
  { label: "Documentation", href: "https://github.com/vikramgorla/mayasura#readme" },
];

const OSS_LINKS = [
  { label: "GitHub Repository", href: "https://github.com/vikramgorla/mayasura" },
  { label: "Report an Issue", href: "https://github.com/vikramgorla/mayasura/issues" },
  { label: "Contributing Guide", href: "https://github.com/vikramgorla/mayasura#contributing" },
  { label: "MIT License", href: "https://github.com/vikramgorla/mayasura/blob/main/LICENSE" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-700 text-white font-bold text-sm">
                M
              </div>
              <span
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Mayasura
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs mb-4">
              An open-source framework for brands to build their complete
              digital communication ecosystem.
            </p>
            <a
              href="https://github.com/vikramgorla/mayasura"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <Github className="h-4 w-4" />
              vikramgorla/mayasura
            </a>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Open Source
            </h3>
            <ul className="space-y-2.5">
              {OSS_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Mayasura. Built with ❤️ as open
            source.
          </p>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            MIT Licensed
          </div>
        </div>
      </div>
    </footer>
  );
}
