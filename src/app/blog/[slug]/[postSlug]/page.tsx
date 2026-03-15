'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useBlogSite } from '../layout';
import { BlogPost } from '@/lib/types';
import { BlogPostMeta, BreadcrumbMeta } from '@/components/site/site-meta';
import { Clock, ArrowLeft, Share2, ChevronLeft, ChevronRight, BookOpen, Tag } from 'lucide-react';

/* ─── Helpers ───────────────────────────────────────────────── */
function readingTime(content: string | null): string {
  if (!content) return '1 min read';
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

interface TOCItem { id: string; text: string; level: number }

function extractTOC(content: string): TOCItem[] {
  const items: TOCItem[] = [];
  for (const line of content.split('\n')) {
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

function renderContent(content: string, textColor: string, accentColor: string, brandFontBody?: string): string {
  return content
    .split('\n\n')
    .map((para) => {
      if (para.startsWith('# ')) {
        const text = para.slice(2);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h1 id="${id}" class="text-3xl font-bold mt-12 mb-5 scroll-mt-24" style="line-height:1.25">${text}</h1>`;
      }
      if (para.startsWith('## ')) {
        const text = para.slice(3);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h2 id="${id}" class="text-2xl font-bold mt-10 mb-4 scroll-mt-24" style="line-height:1.3">${text}</h2>`;
      }
      if (para.startsWith('### ')) {
        const text = para.slice(4);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h3 id="${id}" class="text-xl font-semibold mt-8 mb-3 scroll-mt-24" style="line-height:1.35">${text}</h3>`;
      }
      if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split('\n').map(l => `<li style="margin-bottom:4px;padding-left:4px">${l.replace(/^[-*]\s/, '')}</li>`).join('');
        return `<ul style="padding-left:24px;margin:20px 0;list-style-type:disc">${items}</ul>`;
      }
      if (para.startsWith('1. ') || para.startsWith('1) ')) {
        const items = para.split('\n').map(l => `<li style="margin-bottom:4px;padding-left:4px">${l.replace(/^\d+[.)]\s/, '')}</li>`).join('');
        return `<ol style="padding-left:24px;margin:20px 0;list-style-type:decimal">${items}</ol>`;
      }
      if (para.startsWith('> ')) {
        const text = para.split('\n').map(l => l.replace(/^>\s?/, '')).join('<br/>');
        return `<blockquote style="border-left:3px solid ${accentColor};padding:12px 20px;margin:28px 0;opacity:0.75;font-style:italic">${text}</blockquote>`;
      }
      if (para.startsWith('```')) {
        const lines = para.split('\n');
        const lang = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        return `<pre style="margin:24px 0;padding:20px;border-radius:10px;overflow-x:auto;font-size:0.875em;background:rgba(0,0,0,0.04);font-family:ui-monospace,monospace"><code${lang ? ` class="language-${lang}"` : ''}>${code}</code></pre>`;
      }
      let processed = para
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, `<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-size:0.875em;font-family:ui-monospace,monospace">$1</code>`)
        .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" style="color:${accentColor};text-decoration:underline;text-underline-offset:3px" target="_blank" rel="noopener">$1</a>`);
      return `<p style="line-height:1.85;margin:20px 0">${processed}</p>`;
    })
    .join('');
}

/* ─── Reading Progress Bar ──────────────────────────────────── */
function ReadingProgressBar({ accentColor }: { accentColor: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[9999]"
      style={{ scaleX, backgroundColor: accentColor, transformOrigin: '0%' }}
    />
  );
}

/* ─── Table of Contents ─────────────────────────────────────── */
function TableOfContents({
  toc, activeSection, textColor, accentColor, brandFontHeading, templateId,
}: {
  toc: TOCItem[]; activeSection: string; textColor: string; accentColor: string;
  brandFontHeading?: string; templateId: string;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <h4
          className="text-[11px] font-semibold uppercase tracking-widest mb-4"
          style={{ color: `${textColor}40`, fontFamily: brandFontHeading }}
        >
          {templateId === 'bold' ? 'CONTENTS' : 'On this page'}
        </h4>
        <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block text-xs py-1.5 transition-all hover:opacity-90"
              style={{
                color: activeSection === item.id ? accentColor : `${textColor}40`,
                fontWeight: activeSection === item.id ? 600 : 400,
                borderLeft: `2px solid ${activeSection === item.id ? accentColor : `${textColor}10`}`,
                paddingLeft: `${(item.level - 1) * 12 + 12}px`,
                fontSize: item.level === 1 ? '0.75rem' : '0.6875rem',
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

/* ─── Related Posts ─────────────────────────────────────────── */
function RelatedPosts({
  posts, currentSlug, brandSlug, textColor, accentColor, templateId, brandFontHeading,
}: {
  posts: BlogPost[]; currentSlug: string; brandSlug: string;
  textColor: string; accentColor: string; templateId: string; brandFontHeading?: string;
}) {
  const related = posts
    .filter(p => p.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t" style={{ borderColor: `${textColor}08` }}>
      <h3
        className="text-lg font-bold mb-6"
        style={{
          color: textColor,
          fontFamily: brandFontHeading,
          textTransform: templateId === 'bold' ? 'uppercase' : undefined,
          letterSpacing: templateId === 'bold' ? '-0.01em' : undefined,
        }}
      >
        {templateId === 'bold' ? 'MORE POSTS' : 'Related Posts'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={`/blog/${brandSlug}/${post.slug}`}
              className="group block p-4 transition-all"
              style={{
                border: `1px solid ${textColor}08`,
                borderRadius: templateId === 'playful' ? '16px' : templateId === 'bold' ? '0' : templateId === 'classic' ? '10px' : '0',
              }}
            >
              <div
                className="aspect-[16/9] rounded mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${textColor}04` }}
              >
                <span style={{ color: `${textColor}08`, fontSize: '1.25rem' }}>✦</span>
              </div>
              {post.category && (
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block"
                  style={{ backgroundColor: `${accentColor}12`, color: accentColor }}
                >
                  {post.category}
                </span>
              )}
              <h4
                className="text-sm font-semibold line-clamp-2 group-hover:opacity-70 transition-opacity"
                style={{
                  color: textColor,
                  fontFamily: brandFontHeading,
                  textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                }}
              >
                {post.title}
              </h4>
              <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: `${textColor}35` }}>
                <Clock className="h-2.5 w-2.5" />
                {readingTime(post.content)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
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
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then(r => r.json())
      .then(d => {
        const posts = d.blogPosts || [];
        setAllPosts(posts);
        const found = posts.find((p: BlogPost) => p.slug === postSlug);
        setPost(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, postSlug]);

  // Scroll to top on post change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [postSlug]);

  // Track active section for TOC
  useEffect(() => {
    if (!post?.content) return;
    const toc = extractTOC(post.content);
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
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
      <>
        <ReadingProgressBar accentColor={accentColor} />
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-20 rounded" style={{ backgroundColor: `${textColor}08` }} />
            <div className="h-8 w-2/3 rounded" style={{ backgroundColor: `${textColor}08` }} />
            <div className="h-4 w-full rounded" style={{ backgroundColor: `${textColor}05` }} />
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: `${textColor}05` }} />
          </div>
        </div>
      </>
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

  const tags = (() => { try { return JSON.parse(post.tags || '[]'); } catch { return []; } })();
  const toc = extractTOC(post.content || '');
  const hasTOC = toc.length > 2;

  const currentIndex = allPosts.findIndex(p => p.slug === postSlug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const containerWidth = hasTOC ? 'max-w-6xl' : (templateId === 'bold' ? 'max-w-4xl' : 'max-w-3xl');
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';

  const btnStyle: React.CSSProperties = {
    border: `1px solid ${textColor}12`,
    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
    color: `${textColor}55`,
    padding: '5px 12px',
    fontSize: '0.75rem',
    transition: 'all 0.15s',
  };

  return (
    <>
      {/* Reading progress bar */}
      <ReadingProgressBar accentColor={accentColor} />

      <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
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
        <BreadcrumbMeta items={[
          { name: brand.name, url: `${baseUrl}/site/${slug}` },
          { name: 'Blog', url: `${baseUrl}/blog/${slug}` },
          ...(post.category ? [{ name: post.category, url: `${baseUrl}/blog/${slug}` }] : []),
          { name: post.title, url: `${baseUrl}/blog/${slug}/${post.slug}` },
        ]} />

        <div className={hasTOC ? 'grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-16' : ''}>
          <article ref={articleRef}>
            {/* Breadcrumb */}
            <motion.nav
              className="flex items-center gap-2 mb-8 text-xs"
              style={{ color: `${textColor}40` }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/blog/${slug}`}
                className="flex items-center gap-1 transition-opacity hover:opacity-80 font-medium"
                style={{ color: accentColor }}
              >
                <ArrowLeft className="h-3 w-3" />
                {templateId === 'bold' ? 'ALL POSTS' : 'Blog'}
              </Link>
              <span style={{ color: `${textColor}20` }}>/</span>
              {post.category && (
                <>
                  <span className="transition-opacity hover:opacity-80" style={{ color: `${textColor}40` }}>{post.category}</span>
                  <span style={{ color: `${textColor}20` }}>/</span>
                </>
              )}
              <span className="truncate max-w-[200px]" style={{ color: `${textColor}60` }}>{post.title}</span>
            </motion.nav>

            {/* Post header */}
            <motion.header
              className="mb-12"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {post.category && (
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1"
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
                <span className="flex items-center gap-1 text-xs" style={{ color: `${textColor}35` }}>
                  <Clock className="h-3 w-3" />
                  {readingTime(post.content)}
                </span>
                {toc.length > 0 && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: `${textColor}35` }}>
                    <BookOpen className="h-3 w-3" />
                    {toc.length} sections
                  </span>
                )}
              </div>

              <h1
                className="leading-tight mb-6"
                style={{
                  ...headingStyle,
                  fontSize: templateId === 'bold'
                    ? 'clamp(1.75rem, 4vw, 3rem)'
                    : templateId === 'minimal'
                    ? 'clamp(1.5rem, 3.5vw, 2.5rem)'
                    : 'clamp(1.75rem, 4vw, 2.75rem)',
                  fontWeight: templateId === 'minimal' ? 400 : headingStyle.fontWeight,
                }}
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p
                  className="text-base leading-relaxed"
                  style={{
                    color: `${textColor}60`,
                    fontFamily: templateId === 'editorial' ? brand.font_heading : undefined,
                    lineHeight: 1.7,
                  }}
                >
                  {post.excerpt}
                </p>
              )}

              <div
                className="flex items-center gap-4 mt-6 pt-6 flex-wrap"
                style={{
                  borderTop: `${templateId === 'bold' ? '2px' : '1px'} solid ${textColor}08`,
                }}
              >
                {/* Author */}
                <div className="flex items-center gap-2">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <div
                      className="h-7 w-7 flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                        borderRadius: templateId === 'bold' ? '0' : '50%',
                      }}
                    >
                      {brand.name[0]}
                    </div>
                  )}
                  <span className="text-xs font-medium" style={{ color: textColor }}>{brand.name}</span>
                </div>

                {post.published_at && (
                  <time className="text-xs" style={{ color: `${textColor}40` }}>
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                )}

                {/* Share buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <Share2 className="h-3.5 w-3.5" style={{ color: `${textColor}30` }} />
                  <button onClick={shareTwitter} style={btnStyle} className="hover:opacity-80 transition-opacity">
                    𝕏 Share
                  </button>
                  <button onClick={shareLinkedIn} style={btnStyle} className="hover:opacity-80 transition-opacity">
                    in Share
                  </button>
                  <button
                    onClick={copyLink}
                    style={{ ...btnStyle, color: copied ? accentColor : `${textColor}55`, borderColor: copied ? accentColor : `${textColor}12` }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {copied ? '✓ Copied!' : '🔗 Copy'}
                  </button>
                </div>
              </div>
            </motion.header>

            {/* Post content */}
            <motion.div
              className="max-w-none text-base"
              dangerouslySetInnerHTML={{
                __html: renderContent(post.content || '', textColor, accentColor, brand.font_body),
              }}
              style={{
                fontFamily: brand.font_body,
                color: `${textColor}dd`,
                lineHeight: 1.85,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-12 pt-8 border-t" style={{ borderColor: `${textColor}08` }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-3.5 w-3.5 flex-shrink-0" style={{ color: `${textColor}40` }} />
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
            <div className="mt-12 pt-8 border-t" style={{ borderColor: `${textColor}08` }}>
              <div
                className="p-6 flex items-start gap-4"
                style={{
                  borderRadius: templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0',
                  backgroundColor: isDark ? '#111111' : `${textColor}02`,
                  border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}05`,
                  borderLeft: `3px solid ${accentColor}`,
                }}
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-12 w-12 rounded-full flex-shrink-0 object-cover"
                  />
                ) : (
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
                )}
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ fontFamily: brand.font_heading, color: textColor }}>
                    {brand.name}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: `${textColor}55` }}>
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
                    className="group p-4 transition-all hover:opacity-80 flex items-start gap-3"
                    style={{
                      borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '10px' : templateId === 'bold' ? '0' : '0',
                      border: `1px solid ${textColor}08`,
                    }}
                  >
                    <ChevronLeft className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: `${textColor}35` }} />
                    <div>
                      <span className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: `${textColor}35` }}>Previous</span>
                      <span className="text-sm font-medium group-hover:opacity-60 transition-opacity line-clamp-2" style={{ fontFamily: brand.font_heading, color: textColor }}>
                        {prevPost.title}
                      </span>
                    </div>
                  </Link>
                ) : <div />}

                {nextPost ? (
                  <Link
                    href={`/blog/${slug}/${nextPost.slug}`}
                    className="group p-4 text-right transition-all hover:opacity-80 flex items-start justify-end gap-3"
                    style={{
                      borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '10px' : templateId === 'bold' ? '0' : '0',
                      border: `1px solid ${textColor}08`,
                    }}
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: `${textColor}35` }}>Next</span>
                      <span className="text-sm font-medium group-hover:opacity-60 transition-opacity line-clamp-2" style={{ fontFamily: brand.font_heading, color: textColor }}>
                        {nextPost.title}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: `${textColor}35` }} />
                  </Link>
                ) : <div />}
              </div>
            )}

            {/* Related Posts */}
            <RelatedPosts
              posts={allPosts}
              currentSlug={postSlug}
              brandSlug={slug}
              textColor={textColor}
              accentColor={accentColor}
              templateId={templateId}
              brandFontHeading={brand.font_heading}
            />
          </article>

          {/* Table of Contents sidebar */}
          {hasTOC && (
            <TableOfContents
              toc={toc}
              activeSection={activeSection}
              textColor={textColor}
              accentColor={accentColor}
              brandFontHeading={brand.font_heading}
              templateId={templateId}
            />
          )}
        </div>
      </div>
    </>
  );
}
