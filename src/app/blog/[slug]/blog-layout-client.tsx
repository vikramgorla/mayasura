"use client";

import Link from "next/link";

interface BlogLayoutClientProps {
  brandName: string;
  slug: string;
  accentColor: string;
  children: React.ReactNode;
}

export function BlogLayoutClient({
  brandName,
  slug,
  accentColor,
  children,
}: BlogLayoutClientProps) {
  return (
    <>
      <nav
        className="sticky top-0 z-50 backdrop-blur-lg border-b"
        style={{
          backgroundColor: "rgba(var(--brand-bg-rgb), 0.85)",
          borderColor: "var(--brand-border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            href={`/blog/${slug}`}
            className="font-semibold text-lg"
            style={{
              fontFamily: "var(--brand-font-heading)",
              color: "var(--brand-text)",
            }}
          >
            {brandName}
            <span
              className="text-sm font-normal ml-2"
              style={{ color: "var(--brand-muted)" }}
            >
              Blog
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={`/site/${slug}`}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--brand-muted)" }}
            >
              Website
            </Link>
            <Link
              href={`/shop/${slug}`}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--brand-muted)" }}
            >
              Shop
            </Link>
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-56px)]">{children}</main>

      <footer
        className="border-t py-8 text-center text-sm"
        style={{
          borderColor: "var(--brand-border)",
          color: "var(--brand-muted)",
        }}
      >
        <p>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </footer>
    </>
  );
}
