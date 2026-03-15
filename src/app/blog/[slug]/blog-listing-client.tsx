"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Clock, Calendar } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  publishedAt: string | null;
  createdAt: string;
}

interface BlogListingClientProps {
  slug: string;
  brandName: string;
  posts: BlogPost[];
  accentColor: string;
}

function estimateReadingTime(content: string | null): number {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogListingClient({
  slug,
  brandName,
  posts,
  accentColor,
}: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [posts]);

  const filtered =
    selectedCategory === "all"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <BookOpen
          className="mx-auto mb-4 h-16 w-16"
          style={{ color: "var(--brand-muted)", opacity: 0.5 }}
        />
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            fontFamily: "var(--brand-font-heading)",
            color: "var(--brand-text)",
          }}
        >
          No posts yet
        </h1>
        <p style={{ color: "var(--brand-muted)" }}>
          Check back soon for articles from {brandName}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1
        className="text-3xl sm:text-4xl font-bold mb-2"
        style={{
          fontFamily: "var(--brand-font-heading)",
          color: "var(--brand-text)",
        }}
      >
        Blog
      </h1>
      <p className="mb-8" style={{ color: "var(--brand-muted)" }}>
        Insights and updates from {brandName}
      </p>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 text-sm font-medium rounded-full transition-all"
              style={{
                backgroundColor:
                  selectedCategory === cat
                    ? accentColor
                    : "transparent",
                color:
                  selectedCategory === cat
                    ? "var(--brand-accent-text)"
                    : "var(--brand-muted)",
                border: `1px solid ${
                  selectedCategory === cat
                    ? accentColor
                    : "var(--brand-border)"
                }`,
              }}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Featured Post */}
      {featured && (
        <Link
          href={`/blog/${slug}/${featured.slug}`}
          className="block p-6 border rounded-xl mb-8 transition-all hover:translate-y-[-2px]"
          style={{
            borderColor: "var(--brand-border)",
            backgroundColor: "var(--brand-surface)",
          }}
        >
          {featured.category && (
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              {featured.category}
            </span>
          )}
          <h2
            className="text-xl sm:text-2xl font-bold mt-1 mb-2"
            style={{
              fontFamily: "var(--brand-font-heading)",
              color: "var(--brand-text)",
            }}
          >
            {featured.title}
          </h2>
          {featured.excerpt && (
            <p
              className="text-sm leading-relaxed mb-3 line-clamp-3"
              style={{ color: "var(--brand-muted)" }}
            >
              {featured.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: "var(--brand-muted)" }}
          >
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(featured.publishedAt || featured.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {estimateReadingTime(featured.content)} min read
            </span>
          </div>
        </Link>
      )}

      {/* Post List */}
      <div className="space-y-4">
        {rest.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${slug}/${post.slug}`}
            className="block p-4 border rounded-lg transition-all hover:translate-y-[-1px]"
            style={{
              borderColor: "var(--brand-border)",
              backgroundColor: "var(--brand-surface)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {post.category && (
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    {post.category}
                  </span>
                )}
                <h3
                  className="font-semibold mt-0.5 mb-1"
                  style={{
                    fontFamily: "var(--brand-font-heading)",
                    color: "var(--brand-text)",
                  }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: "var(--brand-muted)" }}
                  >
                    {post.excerpt}
                  </p>
                )}
              </div>
              <div
                className="text-xs shrink-0 flex flex-col items-end gap-1"
                style={{ color: "var(--brand-muted)" }}
              >
                <span>
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
                <span>
                  {estimateReadingTime(post.content)} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
