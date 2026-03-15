"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import {
  renderMarkdown,
  extractHeadings,
  PROSE_STYLES,
} from "@/lib/utils/markdown";

interface Post {
  title: string;
  content: string | null;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
}

interface BlogPostClientProps {
  slug: string;
  brandName: string;
  post: Post;
  accentColor: string;
}

function estimateReadingTime(content: string | null): number {
  if (!content) return 1;
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPostClient({
  slug,
  brandName,
  post,
  accentColor,
}: BlogPostClientProps) {
  const [copied, setCopied] = useState(false);

  const readingTime = useMemo(
    () => estimateReadingTime(post.content),
    [post.content]
  );
  const headings = useMemo(
    () => (post.content ? extractHeadings(post.content) : []),
    [post.content]
  );
  const renderedContent = useMemo(
    () => (post.content ? renderMarkdown(post.content) : ""),
    [post.content]
  );

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  }

  function handleShareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank"
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--brand-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      <header className="mb-8">
        {post.category && (
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {post.category}
          </span>
        )}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1 mb-4"
          style={{
            fontFamily: "var(--brand-font-heading)",
            color: "var(--brand-text)",
            letterSpacing: "-0.025em",
          }}
        >
          {post.title}
        </h1>
        <div
          className="flex flex-wrap items-center gap-4 text-sm"
          style={{ color: "var(--brand-muted)" }}
        >
          <span className="font-medium" style={{ color: "var(--brand-text)" }}>
            {brandName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        </div>
      </header>

      {/* Table of Contents */}
      {headings.length > 2 && (
        <nav
          className="p-4 mb-8 border rounded-lg"
          style={{
            borderColor: "var(--brand-border)",
            backgroundColor: "var(--brand-surface)",
          }}
        >
          <h2
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--brand-text)" }}
          >
            Table of Contents
          </h2>
          <ul className="space-y-1">
            {headings.map((h, i) => (
              <li key={i} style={{ paddingLeft: `${(h.level - 2) * 16}px` }}>
                <a
                  href={`#${h.id}`}
                  className="text-sm transition-opacity hover:opacity-70"
                  style={{ color: accentColor }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Content */}
      <div
        className="prose-custom"
        style={{ "--brand-link-color": accentColor } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
      <style dangerouslySetInnerHTML={{ __html: PROSE_STYLES }} />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: `${accentColor}10`, color: accentColor }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Share Buttons */}
      <div
        className="flex items-center gap-3 mt-8 pt-8 border-t"
        style={{ borderColor: "var(--brand-border)" }}
      >
        <Share2 className="h-4 w-4" style={{ color: "var(--brand-muted)" }} />
        <span className="text-sm" style={{ color: "var(--brand-muted)" }}>
          Share:
        </span>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
          style={{ borderColor: "var(--brand-border)", color: "var(--brand-text)" }}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy link
            </>
          )}
        </button>
        <button
          onClick={handleShareTwitter}
          className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
          style={{ borderColor: "var(--brand-border)", color: "var(--brand-text)" }}
        >
          Twitter
        </button>
        <button
          onClick={handleShareLinkedIn}
          className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
          style={{ borderColor: "var(--brand-border)", color: "var(--brand-text)" }}
        >
          LinkedIn
        </button>
      </div>
    </article>
  );
}
