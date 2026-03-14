'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useBlogSite } from './layout';
import { BlogPost } from '@/lib/types';

function readingTime(content: string | null): string {
  if (!content) return '1 min read';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="mb-12">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4"
          style={{ fontFamily: brand.font_heading }}
        >
          Blog
        </h1>
        <p className="text-lg opacity-60">
          Insights, updates, and stories from {brand.name}
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize"
              style={{
                backgroundColor: filter === cat ? brand.accent_color : `${brand.primary_color}08`,
                color: filter === cat ? '#fff' : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 w-20 rounded bg-slate-200 mb-3" />
              <div className="h-6 w-2/3 rounded bg-slate-200 mb-3" />
              <div className="h-4 w-full rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl opacity-40">No blog posts yet</p>
          <p className="text-sm opacity-30 mt-2">Check back soon for new content!</p>
        </div>
      ) : (
        <div className="space-y-0 divide-y" style={{ borderColor: `${brand.primary_color}10` }}>
          {filtered.map((post) => (
            <article key={post.id} className="py-8 first:pt-0">
              <Link href={`/blog/${slug}/${post.slug}`} className="group block">
                <div className="flex items-center gap-3 mb-3">
                  {post.category && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${brand.accent_color}15`,
                        color: brand.accent_color,
                      }}
                    >
                      {post.category}
                    </span>
                  )}
                  <span className="text-xs opacity-40">
                    {readingTime(post.content)}
                  </span>
                  {post.published_at && (
                    <span className="text-xs opacity-40">
                      · {new Date(post.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-2 group-hover:opacity-70 transition-opacity"
                  style={{ fontFamily: brand.font_heading }}
                >
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="opacity-50 leading-relaxed line-clamp-2">
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
