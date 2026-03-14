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
  const { brand, websiteTemplate: template } = data;
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-20 rounded" style={{ backgroundColor: `${textColor}08` }} />
          <div className="h-8 w-2/3 rounded" style={{ backgroundColor: `${textColor}08` }} />
          <div className="h-4 w-full rounded" style={{ backgroundColor: `${textColor}05` }} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4" style={headingStyle}>Post not found</h1>
        <Link href={`/blog/${slug}`} className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: accentColor }}>
          ← Back to blog
        </Link>
      </div>
    );
  }

  const tags = (() => {
    try { return JSON.parse(post.tags || '[]'); } catch { return []; }
  })();

  const containerWidth = templateId === 'bold' ? 'max-w-4xl' : 'max-w-3xl';

  return (
    <article className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      {/* Back link */}
      <div className="mb-8">
        <Link
          href={`/blog/${slug}`}
          className="text-sm transition-opacity hover:opacity-60"
          style={{
            color: accentColor,
            fontWeight: templateId === 'bold' ? 700 : 400,
            letterSpacing: templateId === 'bold' ? '0.1em' : undefined,
            textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
            fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
          }}
        >
          {templateId === 'bold' ? '← ALL POSTS' : '← Back to blog'}
        </Link>
      </div>

      {/* Post header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{
                color: accentColor,
                fontWeight: templateId === 'bold' ? 700 : 500,
                letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
              }}
            >
              {post.category}
            </span>
          )}
          <span className="text-xs" style={{ color: `${textColor}35` }}>{readingTime(post.content)}</span>
        </div>

        <h1
          className="leading-tight mb-6"
          style={{
            ...headingStyle,
            fontSize: templateId === 'bold' ? 'clamp(1.75rem, 4vw, 3rem)' : templateId === 'minimal' ? 'clamp(1.5rem, 3.5vw, 2.5rem)' : 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: templateId === 'minimal' ? 400 : headingStyle.fontWeight,
          }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-base leading-relaxed" style={{ color: `${textColor}55`, fontFamily: templateId === 'editorial' ? brand.font_heading : undefined }}>
            {post.excerpt}
          </p>
        )}

        <div
          className="flex items-center gap-4 mt-6 pt-6 border-t"
          style={{
            borderColor: `${textColor}08`,
            borderTopWidth: templateId === 'bold' ? '2px' : '1px',
          }}
        >
          {post.published_at && (
            <time className="text-sm" style={{ color: `${textColor}40` }}>
              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          )}
          <button
            onClick={copyLink}
            className="text-sm transition-opacity hover:opacity-60"
            style={{ color: `${textColor}40` }}
          >
            {copied ? '✓ Copied!' : '🔗 Share'}
          </button>
        </div>
      </header>

      {/* Post content */}
      <div
        className="prose max-w-none text-base"
        dangerouslySetInnerHTML={{ __html: renderContent(post.content || '') }}
        style={{
          fontFamily: brand.font_body,
          color: `${textColor}dd`,
          lineHeight: 1.75,
        }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-12 pt-8 border-t" style={{ borderColor: `${textColor}08` }}>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${textColor}06`,
                  color: `${textColor}60`,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '4px',
                  border: templateId === 'bold' ? `1px solid ${textColor}15` : undefined,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div
        className="mt-16 pt-8 border-t text-center"
        style={{
          borderColor: `${textColor}08`,
          borderTopWidth: templateId === 'bold' ? '2px' : '1px',
        }}
      >
        <Link
          href={`/blog/${slug}`}
          className="text-sm font-medium transition-opacity hover:opacity-60"
          style={{
            color: accentColor,
            fontWeight: templateId === 'bold' ? 700 : 500,
            letterSpacing: templateId === 'bold' ? '0.1em' : undefined,
            textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
          }}
        >
          {templateId === 'bold' ? '← ALL POSTS' : '← All Posts'}
        </Link>
      </div>
    </article>
  );
}
