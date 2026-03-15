'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBlogSite } from '../layout';
import { BlogPost } from '@/lib/types';
import { BlogPostMeta } from '@/components/site/site-meta';

function readingTime(content: string | null): string {
  if (!content) return '1 min read';
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function extractTOC(content: string): TOCItem[] {
  const items: TOCItem[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      items.push({ id, text, level });
    }
  }
  return items;
}

function renderContent(content: string): string {
  return content
    .split('\n\n')
    .map((para) => {
      if (para.startsWith('# ')) {
        const text = para.slice(2);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h1 id="${id}" class="text-3xl font-bold mt-12 mb-5 scroll-mt-20" style="line-height:1.25">${text}</h1>`;
      }
      if (para.startsWith('## ')) {
        const text = para.slice(3);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h2 id="${id}" class="text-2xl font-bold mt-10 mb-4 scroll-mt-20" style="line-height:1.3">${text}</h2>`;
      }
      if (para.startsWith('### ')) {
        const text = para.slice(4);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h3 id="${id}" class="text-xl font-semibold mt-8 mb-3 scroll-mt-20" style="line-height:1.35">${text}</h3>`;
      }
      if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split('\n').map((l) => `<li class="ml-4 mb-1">${l.replace(/^[-*]\s/, '')}</li>`).join('');
        return `<ul class="list-disc pl-6 space-y-1 my-5">${items}</ul>`;
      }
      if (para.startsWith('1. ') || para.startsWith('1) ')) {
        const items = para.split('\n').map((l) => `<li class="ml-4 mb-1">${l.replace(/^\d+[.)]\s/, '')}</li>`).join('');
        return `<ol class="list-decimal pl-6 space-y-1 my-5">${items}</ol>`;
      }
      if (para.startsWith('> ')) {
        const text = para.split('\n').map(l => l.replace(/^>\s?/, '')).join('<br/>');
        return `<blockquote class="border-l-4 pl-6 py-2 my-8 italic" style="border-color: currentColor; opacity: 0.7">${text}</blockquote>`;
      }
      if (para.startsWith('```')) {
        const lines = para.split('\n');
        const lang = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        return `<pre class="my-6 p-5 rounded-lg overflow-x-auto text-sm" style="background:rgba(0,0,0,0.04);font-family:monospace"><code${lang ? ` class="language-${lang}"` : ''}>${code}</code></pre>`;
      }
      let processed = para
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded text-[0.875em] font-mono" style="background:rgba(0,0,0,0.05)">$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="underline underline-offset-4 hover:opacity-70" style="text-decoration-color: currentColor">$1</a>');
      return `<p class="leading-relaxed my-5" style="line-height:1.8">${processed}</p>`;
    })
    .join('');
}

export default function BlogPostPage() {
  const data = useBlogSite();
  const params = useParams();
  const slug = params.slug as string;
  const postSlug = params.postSlug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const posts = d.blogPosts || [];
        setAllPosts(posts);
        const found = posts.find((p: BlogPost) => p.slug === postSlug);
        setPost(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, postSlug]);

  // Track active section for TOC highlighting
  useEffect(() => {
    if (!post?.content) return;
    const toc = extractTOC(post.content);
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [post]);

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

  const shareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
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

  const toc = extractTOC(post.content || '');
  const hasTOC = toc.length > 2; // Only show TOC if there are enough headings

  // Find prev/next posts
  const currentIndex = allPosts.findIndex((p) => p.slug === postSlug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const containerWidth = templateId === 'bold' ? 'max-w-4xl' : 'max-w-3xl';

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';

  return (
    <div className={`${hasTOC ? 'max-w-6xl' : containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      <BlogPostMeta
        org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/blog/${slug}`, logoUrl: brand.logo_url }}
        canonicalUrl={`${baseUrl}/blog/${slug}/${post.slug}`}
        article={{
          title: post.title,
          description: post.excerpt,
          publishedAt: post.published_at || post.created_at,
          imageUrl: null,
        }}
      />
      <div className={hasTOC ? 'grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12' : ''}>
        <article>
          {/* Back link */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>

          {/* Post header */}
          <motion.header
            className="mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {post.category && (
                <span
                  className="text-xs font-medium uppercase tracking-wider px-3 py-1"
                  style={{
                    backgroundColor: `${accentColor}12`,
                    color: accentColor,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '4px',
                    fontWeight: templateId === 'bold' ? 700 : 500,
                    letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
                  }}
                >
                  {post.category}
                </span>
              )}
              <span className="text-xs" style={{ color: `${textColor}35` }}>
                {readingTime(post.content)}
              </span>
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
              className="flex items-center gap-4 mt-6 pt-6 border-t flex-wrap"
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
              {/* Share buttons */}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={shareTwitter}
                  className="text-xs px-3 py-1.5 transition-all hover:opacity-70 flex items-center gap-1"
                  style={{
                    border: `1px solid ${textColor}10`,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
                    color: `${textColor}50`,
                  }}
                >
                  𝕏 Share
                </button>
                <button
                  onClick={shareLinkedIn}
                  className="text-xs px-3 py-1.5 transition-all hover:opacity-70 flex items-center gap-1"
                  style={{
                    border: `1px solid ${textColor}10`,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
                    color: `${textColor}50`,
                  }}
                >
                  in Share
                </button>
                <button
                  onClick={copyLink}
                  className="text-xs px-3 py-1.5 transition-all hover:opacity-70"
                  style={{
                    border: `1px solid ${textColor}10`,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
                    color: `${textColor}50`,
                  }}
                >
                  {copied ? '✓ Copied!' : '🔗 Copy'}
                </button>
              </div>
            </div>
          </motion.header>

          {/* Post content — proper prose styling */}
          <motion.div
            className="max-w-none text-base"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content || '') }}
            style={{
              fontFamily: brand.font_body,
              color: `${textColor}dd`,
              lineHeight: 1.8,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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

          {/* Author bio */}
          <div
            className="mt-12 pt-8 border-t"
            style={{ borderColor: `${textColor}08` }}
          >
            <div
              className="p-6 flex items-start gap-4"
              style={{
                borderRadius: templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0',
                backgroundColor: isDark ? '#111111' : `${textColor}03`,
                border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}05`,
              }}
            >
              <div
                className="h-12 w-12 flex-shrink-0 flex items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                  borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '16px' : '12px',
                }}
              >
                {brand.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ fontFamily: brand.font_heading }}>
                  {brand.name}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: `${textColor}50` }}>
                  {brand.description || brand.tagline || `Sharing insights and stories from ${brand.name}.`}
                </p>
              </div>
            </div>
          </div>

          {/* Prev / Next navigation */}
          {(prevPost || nextPost) && (
            <div
              className="mt-12 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4"
              style={{ borderColor: `${textColor}08` }}
            >
              {prevPost ? (
                <Link
                  href={`/blog/${slug}/${prevPost.slug}`}
                  className="group p-4 transition-all hover:opacity-80"
                  style={{
                    borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '10px' : templateId === 'bold' ? '0' : '0',
                    border: `1px solid ${textColor}08`,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: `${textColor}35` }}>
                    ← Previous
                  </span>
                  <span
                    className="text-sm font-medium group-hover:opacity-60 transition-opacity line-clamp-1"
                    style={{ fontFamily: brand.font_heading }}
                  >
                    {prevPost.title}
                  </span>
                </Link>
              ) : <div />}
              {nextPost ? (
                <Link
                  href={`/blog/${slug}/${nextPost.slug}`}
                  className="group p-4 text-right transition-all hover:opacity-80"
                  style={{
                    borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '10px' : templateId === 'bold' ? '0' : '0',
                    border: `1px solid ${textColor}08`,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: `${textColor}35` }}>
                    Next →
                  </span>
                  <span
                    className="text-sm font-medium group-hover:opacity-60 transition-opacity line-clamp-1"
                    style={{ fontFamily: brand.font_heading }}
                  >
                    {nextPost.title}
                  </span>
                </Link>
              ) : <div />}
            </div>
          )}
        </article>

        {/* Table of Contents sidebar — desktop only */}
        {hasTOC && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h4
                className="text-[11px] font-semibold uppercase tracking-widest mb-4"
                style={{
                  color: `${textColor}40`,
                  fontFamily: brand.font_heading,
                }}
              >
                {templateId === 'bold' ? 'CONTENTS' : 'On this page'}
              </h4>
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-xs py-1 transition-all hover:opacity-80"
                    style={{
                      color: activeSection === item.id ? accentColor : `${textColor}40`,
                      fontWeight: activeSection === item.id ? 600 : 400,
                      borderLeft: activeSection === item.id ? `2px solid ${accentColor}` : `1px solid ${textColor}08`,
                      paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
