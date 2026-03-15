'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlogSite } from './layout';
import { BlogPost } from '@/lib/types';
import { BlogIndexMeta, BreadcrumbMeta } from '@/components/site/site-meta';
import { BORDER_RADIUS_MAP } from '@/lib/design-settings';
import { Search, Clock, Share2, ChevronDown, X } from 'lucide-react';
import { getTextOnColor } from '@/lib/color-utils';

/* ─── Helpers ───────────────────────────────────────────────── */
function readingTime(content: string | null): string {
  if (!content) return '1 min';
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

/* ─── Skeleton Card ─────────────────────────────────────────── */
function SkeletonCard({ textColor }: { textColor: string }) {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/9] rounded-xl mb-4" style={{ backgroundColor: `${textColor}06` }} />
      <div className="space-y-2">
        <div className="h-3 w-16 rounded" style={{ backgroundColor: `${textColor}08` }} />
        <div className="h-5 w-full rounded" style={{ backgroundColor: `${textColor}08` }} />
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: `${textColor}05` }} />
      </div>
    </div>
  );
}

/* ─── Hero Skeleton ─────────────────────────────────────────── */
function HeroSkeleton({ textColor }: { textColor: string }) {
  return (
    <div className="animate-pulse mb-16">
      <div className="aspect-[21/9] rounded-2xl mb-8" style={{ backgroundColor: `${textColor}06` }} />
      <div className="space-y-3">
        <div className="h-3 w-24 rounded" style={{ backgroundColor: `${textColor}08` }} />
        <div className="h-8 w-2/3 rounded" style={{ backgroundColor: `${textColor}08` }} />
        <div className="h-4 w-full rounded" style={{ backgroundColor: `${textColor}05` }} />
      </div>
    </div>
  );
}

/* ─── Social Share ──────────────────────────────────────────── */
function SocialShareButtons({
  title, url, accentColor, textColor, templateId,
}: {
  title: string; url: string; accentColor: string; textColor: string; templateId: string;
}) {
  const [copied, setCopied] = useState(false);

  const shareTwitter = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    border: `1px solid ${active ? accentColor : `${textColor}12`}`,
    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
    color: active ? accentColor : `${textColor}45`,
    padding: '3px 10px',
    fontSize: '0.6875rem',
    fontWeight: 500,
    transition: 'all 0.15s',
    backgroundColor: active ? `${accentColor}10` : 'transparent',
  });

  return (
    <div className="flex items-center gap-1.5 mt-3">
      <Share2 className="h-3 w-3 flex-shrink-0" style={{ color: `${textColor}30` }} />
      <button onClick={shareTwitter} style={btnStyle()}>𝕏</button>
      <button onClick={copyLink} style={btnStyle(copied)}>
        {copied ? '✓ Copied' : '🔗 Copy'}
      </button>
    </div>
  );
}

/* ─── Author Card ───────────────────────────────────────────── */
function AuthorCard({
  brandName, description, logoUrl, textColor, accentColor, templateId,
}: {
  brandName: string; description: string | null; logoUrl: string | null;
  textColor: string; accentColor: string; templateId: string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-4"
      style={{
        border: `1px solid ${textColor}08`,
        borderRadius: templateId === 'playful' ? '20px' : templateId === 'bold' ? '0' : '12px',
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={brandName}
          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-base font-bold"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '12px' : '50%',
          }}
        >
          {brandName[0]}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold" style={{ color: textColor }}>{brandName}</p>
        {description && (
          <p className="text-xs line-clamp-1" style={{ color: `${textColor}50` }}>{description}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Blog Post Card (grid) ─────────────────────────────────── */
function BlogCard({
  post, slug, textColor, accentColor, templateId, bgColor, index, dsRadius, dsBorderColor,
}: {
  post: BlogPost; slug: string; textColor: string; accentColor: string;
  templateId: string; bgColor: string; index: number;
  dsRadius?: string; dsBorderColor?: string;
}) {
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const tags = (() => { try { return JSON.parse(post.tags || '[]'); } catch { return []; } })();

  const tagBadgeStyle: React.CSSProperties = {
    backgroundColor: `${accentColor}12`,
    color: accentColor,
    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '4px',
    fontSize: '0.625rem',
    fontWeight: 600,
    padding: '2px 8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blog/${slug}/${post.slug}`
    : `/blog/${slug}/${post.slug}`;

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: index * 0.06 } },
      }}
    >
      <Link
        href={`/blog/${slug}/${post.slug}`}
        className="group block h-full"
        style={{
          borderRadius: templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : (dsRadius || '0'),
          overflow: 'hidden',
          border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${dsBorderColor || `${textColor}06`}`,
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card image */}
        <div
          className="aspect-[16/9] flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
          style={{
            backgroundColor: isDark ? '#111111' : templateId === 'playful'
              ? ['#FFF7ED', '#EFF6FF', '#F0FDF4', '#FAF5FF'][index % 4]
              : `${textColor}03`,
          }}
        >
          <span className="text-3xl transition-transform duration-500 group-hover:scale-110" style={{ color: `${textColor}08` }}>
            {templateId === 'playful' ? '✍️' : '✦'}
          </span>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Meta row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.category && <span style={tagBadgeStyle}>{post.category}</span>}
            {tags.slice(0, 2).map((tag: string) => (
              <span key={tag} style={{
                fontSize: '0.625rem',
                color: `${textColor}40`,
                backgroundColor: `${textColor}05`,
                borderRadius: templateId === 'playful' ? '9999px' : '3px',
                padding: '2px 6px',
              }}>#{tag}</span>
            ))}
          </div>

          <h3
            className="text-base font-semibold mb-2 group-hover:opacity-70 transition-opacity line-clamp-2 flex-shrink-0"
            style={{
              fontFamily: 'inherit',
              textTransform: templateId === 'bold' ? 'uppercase' : undefined,
              letterSpacing: templateId === 'bold' ? '-0.01em' : undefined,
              color: textColor,
            }}
          >
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-xs line-clamp-2 mb-3 flex-1" style={{ color: `${textColor}50`, lineHeight: 1.6 }}>
              {post.excerpt}
            </p>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-[11px]" style={{ color: `${textColor}35` }}>
              {post.published_at && (
                <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              )}
              <span className="flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5" />
                {readingTime(post.content)}
              </span>
            </div>
            <span className="text-xs font-medium transition-opacity group-hover:opacity-100 opacity-0" style={{ color: accentColor }}>
              Read →
            </span>
          </div>

          {/* Social share */}
          <SocialShareButtons
            title={post.title}
            url={shareUrl}
            accentColor={accentColor}
            textColor={textColor}
            templateId={templateId}
          />
        </div>
      </Link>
    </motion.article>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
const PAGE_SIZE = 6;

export default function BlogListingPage() {
  const data = useBlogSite();
  const params = useParams();
  const slug = params.slug as string;
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => r.json())
      .then((d) => { setAllPosts(d.blogPosts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(c => c + PAGE_SIZE);
      setLoadingMore(false);
    }, 600);
  }, []);

  if (!data) return null;
  const { brand, websiteTemplate: template, designSettings } = data;
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? (templateId === 'tech' ? '#0A0F1A' : templateId === 'neon' ? '#050510' : '#000000') : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const dsRadius = BORDER_RADIUS_MAP[designSettings.borderRadius];
  const dsBorderColor = designSettings.borderColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  // Filter + search
  const categories = ['all', ...Array.from(new Set(allPosts.map(p => p.category).filter(Boolean)))] as string[];

  const matchesPosts = allPosts.filter(p => {
    const matchesCat = filter === 'all' || p.category === filter;
    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = matchesPosts.length > 0 ? matchesPosts[0] : null;
  const remaining = matchesPosts.slice(1);
  const visibleRemaining = remaining.slice(0, Math.max(0, displayCount - 1));
  const hasMore = remaining.length > visibleRemaining.length;

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : templateId === 'editorial' ? 'max-w-5xl' : 'max-w-4xl';

  const filterBtnStyle = (active: boolean): React.CSSProperties => {
    if (templateId === 'bold') return {
      backgroundColor: active ? accentColor : 'transparent',
      color: active ? '#FFFFFF' : `${textColor}50`,
      border: `2px solid ${active ? accentColor : `${textColor}15`}`,
      borderRadius: '0', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    };
    if (templateId === 'playful') return {
      backgroundColor: active ? accentColor : `${textColor}05`,
      color: active ? '#FFFFFF' : `${textColor}60`,
      border: 'none', borderRadius: '9999px', fontWeight: 600,
    };
    if (templateId === 'classic') return {
      backgroundColor: active ? accentColor : 'transparent',
      color: active ? '#FFFFFF' : `${textColor}50`,
      border: `1px solid ${active ? accentColor : `${textColor}12`}`,
      borderRadius: '8px', fontWeight: 500,
    };
    return {
      backgroundColor: active ? textColor : 'transparent',
      color: active ? bgColor : `${textColor}50`,
      border: active ? 'none' : `1px solid ${textColor}10`,
      borderRadius: '0',
    };
  };

  const tagBadgeStyle: React.CSSProperties = {
    backgroundColor: `${accentColor}12`,
    color: accentColor,
    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '4px',
    fontSize: '0.625rem',
    fontWeight: 600,
    padding: '2px 8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';
  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-16 sm:py-24`}>
      <BlogIndexMeta
        org={{ brandName: brand.name, description: brand.description, url: canonicalUrl, logoUrl: brand.logo_url }}
        canonicalUrl={canonicalUrl}
        postCount={allPosts.length}
      />
      <BreadcrumbMeta items={[
        { name: brand.name, url: `${baseUrl}/site/${slug}` },
        { name: 'Blog', url: canonicalUrl },
      ]} />
      {/* Header */}
      <div className="mb-12">
        {templateId === 'playful' ? (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full mb-6" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              📝 Blog
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingStyle}>Latest Posts 📖</h1>
            <p className="text-sm" style={{ color: `${textColor}45` }}>Insights, updates, and stories from {brand.name}</p>
          </div>
        ) : templateId === 'bold' ? (
          <>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: accentColor }}>— BLOG</span>
            <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-3" style={headingStyle}>JOURNAL</h1>
            <div className="h-0.5 w-16 mt-4" style={{ backgroundColor: accentColor }} />
          </>
        ) : templateId === 'editorial' ? (
          <>
            <span className="text-xs font-medium uppercase tracking-[0.15em] mb-6 block" style={{ color: accentColor }}>Journal</span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingStyle}>Stories & Insights</h1>
            <p className="text-sm" style={{ color: `${textColor}45` }}>Thoughts, ideas, and narratives from {brand.name}</p>
          </>
        ) : templateId === 'classic' ? (
          <div className="text-center">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.12em] mb-6" style={{ color: accentColor }}>Blog</span>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-3" style={headingStyle}>News & Insights</h1>
            <p className="text-sm" style={{ color: `${textColor}45` }}>Stay informed with the latest from {brand.name}</p>
          </div>
        ) : (
          <>
            <span className="text-xs font-normal uppercase tracking-[0.2em] mb-8 block" style={{ color: `${textColor}25` }}>Journal</span>
            <h1 className="text-2xl font-light tracking-tight mb-3" style={{ ...headingStyle, fontWeight: 300 }}>Journal</h1>
            <p className="text-sm" style={{ color: `${textColor}30` }}>Insights and updates from {brand.name}</p>
          </>
        )}
      </div>

      {/* Search + Filter row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
        {/* Category filter pills */}
        {categories.length > 2 && (
          <div className={`flex flex-wrap gap-2 flex-1 ${templateId === 'classic' || templateId === 'playful' ? 'justify-center' : ''}`}>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileTap={{ scale: 0.96 }}
                className="px-4 py-2 text-xs font-medium tracking-wider transition-all capitalize"
                style={filterBtnStyle(filter === cat)}
              >
                {templateId === 'bold' ? cat.toUpperCase() : cat}
                {cat !== 'all' && (
                  <span className="ml-1.5 opacity-60">
                    ({allPosts.filter(p => p.category === cat).length})
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative flex-shrink-0 w-full sm:w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3" style={{ color: `${textColor}35` }} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(PAGE_SIZE); }}
            placeholder={templateId === 'bold' ? 'SEARCH...' : 'Search posts...'}
            className="w-full pl-8 pr-3 py-2 text-xs outline-none transition-all"
            style={{
              backgroundColor: `${textColor}05`,
              border: `1px solid ${textColor}10`,
              borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '9999px' : '8px',
              color: textColor,
              fontWeight: templateId === 'bold' ? 700 : 400,
              letterSpacing: templateId === 'bold' ? '0.05em' : undefined,
            }}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
              >
                <X className="h-3 w-3" style={{ color: `${textColor}40` }} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Author Card (only when has content) */}
      {!loading && allPosts.length > 0 && (
        <div className="mb-10">
          <AuthorCard
            brandName={brand.name}
            description={brand.description}
            logoUrl={brand.logo_url}
            textColor={textColor}
            accentColor={accentColor}
            templateId={templateId}
          />
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-12">
          <HeroSkeleton textColor={textColor} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} textColor={textColor} />)}
          </div>
        </div>
      ) : matchesPosts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm" style={{ color: `${textColor}35` }}>
            {searchQuery
              ? `No posts found for "${searchQuery}"`
              : templateId === 'playful' ? 'No posts yet. Check back soon! ✍️' : 'No posts yet. Check back soon.'}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Featured post hero */}
            {featured && (
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href={`/blog/${slug}/${featured.slug}`}
                  className="group block"
                  style={{
                    borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '16px' : templateId === 'bold' ? '0' : '0',
                    overflow: 'hidden',
                    border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}06`,
                    boxShadow: templateId === 'classic' ? '8px 8px 16px rgba(0,0,0,0.04), -8px -8px 16px rgba(255,255,255,0.7)' : undefined,
                  }}
                >
                  {/* Hero image */}
                  <div
                    className="aspect-[21/9] flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: isDark ? '#111111' : `${accentColor}06` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl transition-transform duration-700 group-hover:scale-110" style={{ color: `${textColor}05` }}>
                        {templateId === 'playful' ? '📖' : '✦'}
                      </span>
                    </div>
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{ background: `linear-gradient(135deg, ${accentColor}20, transparent)` }}
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                        style={{
                          backgroundColor: accentColor,
                          color: getTextOnColor(accentColor),
                          borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
                        }}
                      >
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5"
                      style={{
                        backgroundColor: `${bgColor}cc`,
                        backdropFilter: 'blur(8px)',
                        color: `${textColor}80`,
                        borderRadius: '6px',
                      }}
                    >
                      <Clock className="h-3 w-3" />
                      {readingTime(featured.content)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      {featured.category && <span style={tagBadgeStyle}>{featured.category}</span>}
                      {featured.published_at && (
                        <span className="text-[11px]" style={{ color: `${textColor}35` }}>
                          {new Date(featured.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <h2
                      className="text-xl sm:text-2xl font-bold mb-3 group-hover:opacity-70 transition-opacity"
                      style={{
                        fontFamily: brand.font_heading,
                        color: textColor,
                        textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                      }}
                    >
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: `${textColor}55`, lineHeight: 1.7 }}>
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: accentColor,
                          fontWeight: templateId === 'bold' ? 700 : 500,
                        }}
                      >
                        {templateId === 'bold' ? 'READ MORE →' : templateId === 'playful' ? 'Read More →' : 'Read article →'}
                      </span>
                      <SocialShareButtons
                        title={featured.title}
                        url={typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}/${featured.slug}` : ''}
                        accentColor={accentColor}
                        textColor={textColor}
                        templateId={templateId}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid of remaining posts */}
            {visibleRemaining.length > 0 && (
              <motion.div
                className={`grid grid-cols-1 ${templateId === 'bold' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-8 mb-12`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {visibleRemaining.map((post, i) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    slug={slug}
                    textColor={textColor}
                    accentColor={accentColor}
                    templateId={templateId}
                    bgColor={bgColor}
                    index={i}
                    dsRadius={dsRadius}
                    dsBorderColor={dsBorderColor}
                  />
                ))}
              </motion.div>
            )}

            {/* Load more / skeletons */}
            {hasMore && (
              <div className="flex flex-col items-center gap-4 mt-4">
                <AnimatePresence>
                  {loadingMore && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`grid grid-cols-1 ${templateId === 'bold' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 w-full mb-4`}
                    >
                      {Array.from({ length: 2 }).map((_, i) => (
                        <SkeletonCard key={i} textColor={textColor} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.button
                  onClick={loadMore}
                  disabled={loadingMore}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all"
                  style={{
                    border: `1px solid ${textColor}15`,
                    color: `${textColor}60`,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '8px',
                    fontWeight: templateId === 'bold' ? 700 : 500,
                    letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                    textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                  }}
                >
                  {loadingMore ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      {templateId === 'bold' ? `LOAD MORE (${remaining.length - visibleRemaining.length})` : `Load more (${remaining.length - visibleRemaining.length})`}
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
