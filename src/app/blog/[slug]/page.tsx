'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : templateId === 'editorial' ? 'max-w-5xl' : 'max-w-3xl';

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
      ) : templateId === 'editorial' ? (
        // EDITORIAL — Magazine layout: featured post + side list
        <div>
          {/* Featured first post */}
          {filtered[0] && (
            <Link href={`/blog/${slug}/${filtered[0].slug}`} className="group block mb-12 pb-12 border-b" style={{ borderColor: `${textColor}08` }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[16/10]" style={{ backgroundColor: `${textColor}04` }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl" style={{ color: `${textColor}08` }}>✦</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {filtered[0].category && (
                      <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: accentColor }}>
                        {filtered[0].category}
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: `${textColor}30` }}>
                      {readingTime(filtered[0].content)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading }}>
                    {filtered[0].title}
                  </h2>
                  {filtered[0].excerpt && (
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: `${textColor}50` }}>
                      {filtered[0].excerpt}
                    </p>
                  )}
                  {filtered[0].published_at && (
                    <p className="text-xs mt-4" style={{ color: `${textColor}30` }}>
                      {new Date(filtered[0].published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )}

          {/* Remaining posts in columns */}
          {filtered.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              {filtered.slice(1).map((post, i) => (
                <article key={post.id}>
                  {i > 0 && i > 1 && <div className="md:hidden h-px my-8" style={{ backgroundColor: `${textColor}08` }} />}
                  <Link href={`/blog/${slug}/${post.slug}`} className="group block py-6 border-b" style={{ borderColor: `${textColor}06` }}>
                    <div className="flex items-center gap-3 mb-2">
                      {post.category && (
                        <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: `${textColor}35` }}>
                          {post.category}
                        </span>
                      )}
                      <span className="text-[10px]" style={{ color: `${textColor}25` }}>
                        {readingTime(post.content)}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading }}>
                      {post.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : templateId === 'bold' ? (
        // BOLD — Zine-like grid with thick borders
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${slug}/${post.slug}`}
              className="group block border-2 p-6 transition-transform hover:translate-y-[-2px]"
              style={{ borderColor: `${textColor}12` }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                {post.category || 'Article'}
              </span>
              <h3 className="text-lg font-bold uppercase mt-2 mb-3 group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading }}>
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-xs line-clamp-2 mb-4" style={{ color: `${textColor}40` }}>
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3">
                {post.published_at && (
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: `${textColor}25` }}>
                    {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider" style={{ color: `${textColor}20` }}>
                  {readingTime(post.content)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : templateId === 'playful' ? (
        // PLAYFUL — Card-based layout with pastel backgrounds
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => {
            const pastels = ['#FFF7ED', '#EFF6FF', '#F0FDF4', '#FAF5FF', '#FFF1F2'];
            return (
              <Link
                key={post.id}
                href={`/blog/${slug}/${post.slug}`}
                className="group block p-6 transition-all hover:translate-y-[-4px] hover:shadow-lg"
                style={{ backgroundColor: pastels[i % pastels.length], borderRadius: '20px' }}
              >
                <span className="text-xs font-semibold" style={{ color: accentColor }}>
                  {post.category || 'Article'}
                </span>
                <h3 className="text-base font-bold mt-2 mb-3 group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading, color: '#1F2937' }}>
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs line-clamp-2 mb-4" style={{ color: '#1F293780' }}>
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[10px]" style={{ color: '#1F293750' }}>
                  {post.published_at && (
                    <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  )}
                  <span>· {readingTime(post.content)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        // MINIMAL / CLASSIC — Clean list with dividers
        <div className="space-y-0">
          {filtered.map((post, i) => (
            <article key={post.id}>
              {i > 0 && (
                <div className="h-px my-10" style={{ backgroundColor: `${textColor}06` }} />
              )}
              <Link href={`/blog/${slug}/${post.slug}`} className="group block">
                <div className="flex items-center gap-3 mb-4">
                  {post.category && (
                    <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: `${textColor}35` }}>
                      {post.category}
                    </span>
                  )}
                  {post.published_at && (
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: `${textColor}25` }}>
                      {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: `${textColor}20` }}>
                    {readingTime(post.content)}
                  </span>
                </div>
                <h2
                  className={`${templateId === 'classic' ? 'text-lg' : 'text-xl sm:text-2xl'} font-semibold mb-3 group-hover:opacity-60 transition-opacity`}
                  style={{ fontFamily: brand.font_heading, fontWeight: templateId === 'minimal' ? 400 : 600 }}
                >
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: `${textColor}45` }}>
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
