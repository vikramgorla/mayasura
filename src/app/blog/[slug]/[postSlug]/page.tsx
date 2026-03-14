'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useBlogSite } from '../layout';
import { BlogPost } from '@/lib/types';

function readingTime(content: string | null): string {
  if (!content) return '1 min read';
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function renderContent(content: string): string {
  // Simple markdown-like rendering
  return content
    .split('\n\n')
    .map((para) => {
      if (para.startsWith('# ')) {
        return `<h1 class="text-3xl font-bold mt-10 mb-4">${para.slice(2)}</h1>`;
      }
      if (para.startsWith('## ')) {
        return `<h2 class="text-2xl font-bold mt-8 mb-3">${para.slice(3)}</h2>`;
      }
      if (para.startsWith('### ')) {
        return `<h3 class="text-xl font-semibold mt-6 mb-2">${para.slice(4)}</h3>`;
      }
      if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split('\n').map((l) => `<li class="ml-4">${l.replace(/^[-*]\s/, '')}</li>`).join('');
        return `<ul class="list-disc pl-4 space-y-1 my-4">${items}</ul>`;
      }
      if (para.startsWith('> ')) {
        return `<blockquote class="border-l-4 pl-4 italic opacity-70 my-6" style="border-color: currentColor">${para.slice(2)}</blockquote>`;
      }
      // Bold and italic
      let processed = para
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/5 text-sm font-mono">$1</code>');
      return `<p class="leading-relaxed my-4">${processed}</p>`;
    })
    .join('');
}

export default function BlogPostPage() {
  const data = useBlogSite();
  const params = useParams();
  const slug = params.slug as string;
  const postSlug = params.postSlug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const found = (d.blogPosts || []).find((p: BlogPost) => p.slug === postSlug);
        setPost(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, postSlug]);

  if (!data) return null;
  const { brand } = data;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-20 rounded bg-zinc-200" />
          <div className="h-8 w-2/3 rounded bg-zinc-200" />
          <div className="h-4 w-full rounded bg-zinc-200" />
          <div className="h-4 w-5/6 rounded bg-zinc-200" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link
          href={`/blog/${slug}`}
          className="hover:opacity-80"
          style={{ color: brand.accent_color }}
        >
          ← Back to blog
        </Link>
      </div>
    );
  }

  const tags = (() => {
    try { return JSON.parse(post.tags || '[]'); } catch { return []; }
  })();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href={`/blog/${slug}`}
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: brand.accent_color }}
        >
          ← Back to blog
        </Link>
      </div>

      {/* Post header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${brand.accent_color}15`,
                color: brand.accent_color,
              }}
            >
              {post.category}
            </span>
          )}
          <span className="text-sm opacity-40">{readingTime(post.content)}</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
          style={{ fontFamily: brand.font_heading }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg opacity-60 leading-relaxed">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-4 mt-6 pt-6 border-t" style={{ borderColor: `${brand.primary_color}10` }}>
          {post.published_at && (
            <time className="text-sm opacity-50">
              {new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          )}
          <button
            onClick={copyLink}
            className="text-sm opacity-50 hover:opacity-80 transition-opacity"
          >
            {copied ? '✓ Copied!' : '🔗 Share'}
          </button>
        </div>
      </header>

      {/* Post content */}
      <div
        className="prose max-w-none text-base"
        dangerouslySetInnerHTML={{ __html: renderContent(post.content || '') }}
        style={{ fontFamily: brand.font_body }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-12 pt-8 border-t" style={{ borderColor: `${brand.primary_color}10` }}>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${brand.primary_color}08` }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-16 pt-8 border-t text-center" style={{ borderColor: `${brand.primary_color}10` }}>
        <Link
          href={`/blog/${slug}`}
          className="text-sm font-semibold hover:opacity-80"
          style={{ color: brand.accent_color }}
        >
          ← All Posts
        </Link>
      </div>
    </article>
  );
}
