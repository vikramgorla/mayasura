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
  const { brand } = data;

  const categories = ['all', ...new Set(posts.map((p) => p.category).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
      {/* Header */}
      <div className="mb-16">
        <span
          className="text-xs font-medium uppercase tracking-widest mb-6 block"
          style={{ color: `${brand.primary_color}40` }}
        >
          Blog
        </span>
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3"
          style={{ fontFamily: brand.font_heading }}
        >
          Journal
        </h1>
        <p className="text-sm" style={{ color: `${brand.primary_color}50` }}>
          Insights, updates, and stories from {brand.name}
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all capitalize"
              style={{
                backgroundColor: filter === cat ? brand.primary_color : 'transparent',
                color: filter === cat ? brand.secondary_color : `${brand.primary_color}50`,
                border: filter === cat ? 'none' : `1px solid ${brand.primary_color}12`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 w-16 rounded bg-zinc-100 mb-4" />
              <div className="h-5 w-3/4 rounded bg-zinc-100 mb-3" />
              <div className="h-3 w-full rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: `${brand.primary_color}40` }}>
            No posts yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {filtered.map((post, i) => (
            <article key={post.id}>
              {i > 0 && (
                <div className="h-px my-10" style={{ backgroundColor: `${brand.primary_color}08` }} />
              )}
              <Link href={`/blog/${slug}/${post.slug}`} className="group block">
                <div className="flex items-center gap-3 mb-4">
                  {post.category && (
                    <span
                      className="text-[10px] font-medium uppercase tracking-widest"
                      style={{ color: `${brand.primary_color}40` }}
                    >
                      {post.category}
                    </span>
                  )}
                  {post.published_at && (
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: `${brand.primary_color}30` }}>
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: `${brand.primary_color}25` }}>
                    {readingTime(post.content)}
                  </span>
                </div>
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-3 group-hover:opacity-60 transition-opacity"
                  style={{ fontFamily: brand.font_heading }}
                >
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: `${brand.primary_color}50` }}>
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
