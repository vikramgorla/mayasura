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

/** Simple markdown-to-HTML renderer for basic formatting */
function renderMarkdown(content: string): string {
  let html = content
    // Code blocks
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre><code class="lang-$1">$2</code></pre>'
    )
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headings
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr/>")
    // Paragraphs — wrap remaining text blocks
    .replace(/\n\n/g, "</p><p>")
    // Line breaks
    .replace(/\n/g, "<br/>");

  // Wrap in paragraph
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, "").replace(/<p><br\/><\/p>/g, "");

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li>.*?<\/li>(?:<br\/>)?)+/g,
    (match) => `<ul>${match.replace(/<br\/>/g, "")}</ul>`
  );

  return html;
}

/** Extract headings for table of contents */
function extractHeadings(
  content: string
): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /^(#{2,4}) (.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const hashes = match[1];
    const text = match[2];
    if (!hashes || !text) continue;
    const level = hashes.length;
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }

  return headings;
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
      {/* Back link */}
      <Link
        href={`/blog/${slug}`}
        className="inline-flex items-center gap-2 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "var(--brand-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </Link>

      {/* Header */}
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
              <li
                key={i}
                style={{
                  paddingLeft: `${(h.level - 2) * 16}px`,
                }}
              >
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
        style={
          {
            "--brand-link-color": accentColor,
          } as React.CSSProperties
        }
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .prose-custom { line-height: 1.75; font-size: 1rem; }
            .prose-custom h1, .prose-custom h2, .prose-custom h3, .prose-custom h4 {
              font-family: var(--brand-font-heading);
              color: var(--brand-text);
              margin-top: 2em;
              margin-bottom: 0.5em;
              letter-spacing: -0.025em;
            }
            .prose-custom h2 { font-size: 1.5rem; font-weight: 700; }
            .prose-custom h3 { font-size: 1.25rem; font-weight: 600; }
            .prose-custom h4 { font-size: 1.125rem; font-weight: 600; }
            .prose-custom p { margin-bottom: 1em; color: var(--brand-text); }
            .prose-custom a { color: var(--brand-link-color); text-decoration: underline; }
            .prose-custom strong { font-weight: 600; }
            .prose-custom ul, .prose-custom ol { padding-left: 1.5em; margin-bottom: 1em; }
            .prose-custom li { margin-bottom: 0.25em; color: var(--brand-text); }
            .prose-custom blockquote {
              border-left: 3px solid var(--brand-link-color);
              padding-left: 1em;
              margin: 1em 0;
              font-style: italic;
              color: var(--brand-muted);
            }
            .prose-custom code {
              background: var(--brand-border);
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 0.875em;
            }
            .prose-custom pre {
              background: var(--brand-surface);
              border: 1px solid var(--brand-border);
              padding: 1em;
              border-radius: 8px;
              overflow-x: auto;
              margin: 1em 0;
            }
            .prose-custom pre code { background: none; padding: 0; }
            .prose-custom hr {
              border: none;
              border-top: 1px solid var(--brand-border);
              margin: 2em 0;
            }
          `,
        }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${accentColor}10`,
                color: accentColor,
              }}
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
        <Share2
          className="h-4 w-4"
          style={{ color: "var(--brand-muted)" }}
        />
        <span className="text-sm" style={{ color: "var(--brand-muted)" }}>
          Share:
        </span>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
          style={{
            borderColor: "var(--brand-border)",
            color: "var(--brand-text)",
          }}
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
          style={{
            borderColor: "var(--brand-border)",
            color: "var(--brand-text)",
          }}
        >
          Twitter
        </button>
        <button
          onClick={handleShareLinkedIn}
          className="px-3 py-1.5 text-xs font-medium rounded-full border transition-all"
          style={{
            borderColor: "var(--brand-border)",
            color: "var(--brand-text)",
          }}
        >
          LinkedIn
        </button>
      </div>
    </article>
  );
}
