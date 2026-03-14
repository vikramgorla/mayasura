'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBlogSite } from './layout';
import { BlogPost } from '@/lib/types';

function readingTime(content: string | null): string {
  if (!content) return '1 min';
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function BlogListingPage() {
  const data = useBlogSite();
  const params = useParams();
  const slug = params.slug as string;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.blogPosts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

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

  const categories = ['all', ...new Set(posts.map((p) => p.category).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter);
  const featured = filtered.length > 0 ? filtered[0] : null;
  const remaining = filtered.slice(1);

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : templateId === 'editorial' ? 'max-w-5xl' : 'max-w-4xl';

  // Filter button style per template
  const filterBtnStyle = (active: boolean): React.CSSProperties => {
    if (templateId === 'bold') {
      return {
        backgroundColor: active ? accentColor : 'transparent',
        color: active ? '#FFFFFF' : `${textColor}50`,
        border: `2px solid ${active ? accentColor : `${textColor}15`}`,
        borderRadius: '0', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      };
    }
    if (templateId === 'playful') {
      return {
        backgroundColor: active ? accentColor : `${textColor}05`,
        color: active ? '#FFFFFF' : `${textColor}60`,
        border: 'none', borderRadius: '9999px', fontWeight: 600,
      };
    }
    if (templateId === 'classic') {
      return {
        backgroundColor: active ? accentColor : 'transparent',
        color: active ? '#FFFFFF' : `${textColor}50`,
        border: `1px solid ${active ? accentColor : `${textColor}12`}`,
        borderRadius: '8px', fontWeight: 500,
      };
    }
    return {
      backgroundColor: active ? textColor : 'transparent',
      color: active ? bgColor : `${textColor}50`,
      border: active ? 'none' : `1px solid ${textColor}10`,
      borderRadius: '0',
    };
  };

  // Tag/category badge style
  const tagBadgeStyle: React.CSSProperties = {
    backgroundColor: `${accentColor}12`,
    color: accentColor,
    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '4px',
    fontSize: '0.625rem',
    fontWeight: 600,
    padding: '2px 8px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  };

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-16 sm:py-24`}>
      {/* Header */}
      <div className="mb-16">
        {templateId === 'playful' ? (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full mb-6" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              📝 Blog
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingStyle}>
              Latest Posts 📖
            </h1>
            <p className="text-sm" style={{ color: `${textColor}45` }}>
              Insights, updates, and stories from {brand.name}
            </p>
          </div>
        ) : templateId === 'bold' ? (
          <>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: accentColor }}>
              — BLOG
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-3" style={headingStyle}>
              JOURNAL
            </h1>
            <div className="h-0.5 w-16 mt-4" style={{ backgroundColor: accentColor }} />
          </>
        ) : templateId === 'editorial' ? (
          <>
            <span className="text-xs font-medium uppercase tracking-[0.15em] mb-6 block" style={{ color: accentColor }}>
              Journal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingStyle}>
              Stories & Insights
            </h1>
            <p className="text-sm" style={{ color: `${textColor}45` }}>
              Thoughts, ideas, and narratives from {brand.name}
            </p>
          </>
        ) : templateId === 'classic' ? (
          <div className="text-center">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.12em] mb-6" style={{ color: accentColor }}>
              Blog
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-3" style={headingStyle}>
              News & Insights
            </h1>
            <p className="text-sm" style={{ color: `${textColor}45` }}>
              Stay informed with the latest from {brand.name}
            </p>
          </div>
        ) : (
          // Minimal
          <>
            <span className="text-xs font-normal uppercase tracking-[0.2em] mb-8 block" style={{ color: `${textColor}25` }}>
              Journal
            </span>
            <h1 className="text-2xl font-light tracking-tight mb-3" style={{ ...headingStyle, fontWeight: 300 }}>
              Journal
            </h1>
            <p className="text-sm" style={{ color: `${textColor}30` }}>
              Insights and updates from {brand.name}
            </p>
          </>
        )}
      </div>

      {/* Category filter */}
      {categories.length > 2 && (
        <div className={`flex flex-wrap gap-2 mb-12 ${templateId === 'classic' || templateId === 'playful' ? 'justify-center' : ''}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-2 text-xs font-medium tracking-wider transition-all capitalize"
              style={filterBtnStyle(filter === cat)}
            >
              {templateId === 'bold' ? cat.toUpperCase() : cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 w-16 rounded mb-4" style={{ backgroundColor: `${textColor}08` }} />
              <div className="h-5 w-3/4 rounded mb-3" style={{ backgroundColor: `${textColor}08` }} />
              <div className="h-3 w-full rounded" style={{ backgroundColor: `${textColor}05` }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: `${textColor}35` }}>
            {templateId === 'playful' ? 'No posts yet. Check back soon! ✍️' : 'No posts yet. Check back soon.'}
          </p>
        </div>
      ) : (
        <>
          {/* Featured post — large card at top */}
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
                {/* Featured image area */}
                <div
                  className="aspect-[21/9] flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: isDark ? '#111111' : `${accentColor}06` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl transition-transform duration-500 group-hover:scale-110" style={{ color: `${textColor}06` }}>
                      {templateId === 'playful' ? '📖' : '✦'}
                    </span>
                  </div>
                  {/* Featured badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        backgroundColor: accentColor,
                        color: '#FFFFFF',
                        borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
                      }}
                    >
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {featured.category && (
                      <span style={tagBadgeStyle}>{featured.category}</span>
                    )}
                    <span className="text-[11px]" style={{ color: `${textColor}35` }}>
                      {readingTime(featured.content)}
                    </span>
                    {featured.published_at && (
                      <span className="text-[11px]" style={{ color: `${textColor}25` }}>
                        {new Date(featured.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h2
                    className="text-xl sm:text-2xl font-bold mb-3 group-hover:opacity-70 transition-opacity"
                    style={{
                      fontFamily: brand.font_heading,
                      textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                    }}
                  >
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: `${textColor}50` }}>
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="mt-4">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: accentColor,
                        fontWeight: templateId === 'bold' ? 700 : 500,
                      }}
                    >
                      {templateId === 'bold' ? 'READ MORE →' : templateId === 'playful' ? 'Read More →' : 'Read article →'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Remaining posts grid */}
          {remaining.length > 0 && (
            <motion.div
              className={`grid grid-cols-1 ${templateId === 'bold' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-8`}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {remaining.map((post) => {
                const tags = (() => {
                  try { return JSON.parse(post.tags || '[]'); } catch { return []; }
                })();

                return (
                  <motion.article
                    key={post.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    }}
                  >
                    <Link
                      href={`/blog/${slug}/${post.slug}`}
                      className="group block h-full"
                      style={{
                        borderRadius: templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0',
                        overflow: 'hidden',
                        border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}06`,
                        boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Card image area */}
                      <div
                        className="aspect-[16/9] flex items-center justify-center relative transition-colors group-hover:opacity-80"
                        style={{
                          backgroundColor: isDark ? '#111111' : templateId === 'playful'
                            ? ['#FFF7ED', '#EFF6FF', '#F0FDF4', '#FAF5FF'][remaining.indexOf(post) % 4]
                            : `${textColor}03`,
                        }}
                      >
                        <span className="text-2xl" style={{ color: `${textColor}08` }}>
                          {templateId === 'playful' ? '✍️' : '✦'}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {post.category && (
                            <span style={tagBadgeStyle}>{post.category}</span>
                          )}
                          {tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5" style={{
                              backgroundColor: `${textColor}05`,
                              color: `${textColor}45`,
                              borderRadius: templateId === 'playful' ? '9999px' : '3px',
                            }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <h3
                          className="text-base font-semibold mb-2 group-hover:opacity-60 transition-opacity"
                          style={{
                            fontFamily: brand.font_heading,
                            textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                          }}
                        >
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-xs line-clamp-2 mb-4 flex-1" style={{ color: `${textColor}45` }}>
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[11px] mt-auto" style={{ color: `${textColor}30` }}>
                          {post.published_at && (
                            <span>
                              {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                          <span>· {readingTime(post.content)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
