'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Twitter, Instagram, Linkedin, Search, Share2, Globe,
  CheckCircle2, Circle, ExternalLink, Image as ImageIcon,
  Hash, FileText, Users, Sparkles, Loader2, Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';
import type { Brand } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────
interface BrandWithCounts extends Brand {
  productCount: number;
  blogPostCount: number;
}

// ─── Social Preview Cards ─────────────────────────────────────────

function TwitterPreview({ brand }: { brand: Brand }) {
  const displayName = brand.name;
  const handle = `@${brand.slug || brand.name.toLowerCase().replace(/\s+/g, '')}`;
  const description = brand.description || brand.tagline || `Welcome to ${brand.name}`;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-zinc-900 dark:bg-white flex items-center justify-center">
            <Twitter className="h-3.5 w-3.5 text-white dark:text-zinc-900" />
          </div>
          X (Twitter)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-950">
          <div className="flex gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: brand.accent_color, color: '#fff' }}
            >
              {brand.logo_url ? (
                <img src={brand.logo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{displayName}</span>
                <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.88 13.43 2 12 2s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.88 9.33 2 10.57 2 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81C9.33 21.12 10.57 22 12 22s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91C21.12 14.67 22 13.43 22 12zm-11.07 4.83-3.47-3.47 1.41-1.41 2.06 2.06 4.18-4.18 1.41 1.41-5.59 5.59z" /></svg>
              </div>
              <span className="text-xs text-zinc-400">{handle}</span>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2 leading-relaxed">
                {description.length > 200 ? description.slice(0, 200) + '...' : description}
              </p>
              <div className="flex gap-4 mt-3 text-xs text-zinc-400">
                <span>💬 24</span>
                <span>🔄 89</span>
                <span>❤️ 342</span>
                <span>📊 12.4K</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-2">Preview of how your brand would look on X</p>
      </CardContent>
    </Card>
  );
}

function InstagramPreview({ brand }: { brand: Brand }) {
  const handle = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
            <Instagram className="h-3.5 w-3.5 text-white" />
          </div>
          Instagram
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
          {/* Profile header */}
          <div className="p-4 flex items-center gap-3">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-zinc-950"
              style={{ backgroundColor: brand.accent_color, color: '#fff' }}
            >
              {brand.logo_url ? (
                <img src={brand.logo_url} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                brand.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-900 dark:text-white">{handle}</p>
              <div className="flex gap-4 mt-1 text-xs text-zinc-500">
                <span><strong className="text-zinc-900 dark:text-white">42</strong> posts</span>
                <span><strong className="text-zinc-900 dark:text-white">1.2K</strong> followers</span>
                <span><strong className="text-zinc-900 dark:text-white">89</strong> following</span>
              </div>
            </div>
          </div>
          {/* Grid */}
          <div className="grid grid-cols-3 gap-0.5 px-0.5 pb-0.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center"
                style={{
                  backgroundColor: `${brand.accent_color}${(15 + i * 8).toString(16).padStart(2, '0')}`,
                }}
              >
                <ImageIcon className="h-5 w-5" style={{ color: `${brand.primary_color}15` }} />
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-2">How your profile grid would look on Instagram</p>
      </CardContent>
    </Card>
  );
}

function LinkedInPreview({ brand }: { brand: Brand }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[#0A66C2] flex items-center justify-center">
            <Linkedin className="h-3.5 w-3.5 text-white" />
          </div>
          LinkedIn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
          {/* Banner */}
          <div
            className="h-20 w-full"
            style={{ background: `linear-gradient(135deg, ${brand.primary_color}, ${brand.accent_color})` }}
          />
          <div className="p-4 -mt-8">
            <div
              className="h-16 w-16 rounded-lg flex items-center justify-center text-xl font-bold border-2 border-white dark:border-zinc-950"
              style={{ backgroundColor: brand.accent_color, color: '#fff' }}
            >
              {brand.logo_url ? (
                <img src={brand.logo_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                brand.name.charAt(0).toUpperCase()
              )}
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-2">{brand.name}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{brand.tagline || brand.industry || 'Company'}</p>
            <p className="text-xs text-zinc-400 mt-1">{brand.industry ? `${brand.industry} · ` : ''}1-10 employees</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#0A66C2] text-white">+ Follow</span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full border border-[#0A66C2] text-[#0A66C2]">Visit website</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mt-2">Preview of your LinkedIn company page</p>
      </CardContent>
    </Card>
  );
}

function GoogleSerpPreview({ brand }: { brand: Brand }) {
  const slug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-');
  const siteUrl = `mayasura.app/site/${slug}`;
  const description = brand.description || brand.tagline || `Welcome to ${brand.name}. Discover our products and services.`;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            <Search className="h-3.5 w-3.5 text-zinc-600" />
          </div>
          Google Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: brand.accent_color, color: '#fff' }}
            >
              {brand.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300">{brand.name}</p>
              <p className="text-[11px] text-zinc-400">{siteUrl}</p>
            </div>
          </div>
          <h3 className="text-lg font-normal text-[#1a0dab] dark:text-blue-400 hover:underline cursor-pointer">
            {brand.name}{brand.tagline ? ` — ${brand.tagline}` : ''}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            {description.length > 160 ? description.slice(0, 160) + '...' : description}
          </p>
        </div>
        <p className="text-xs text-zinc-400 mt-2">How your site appears in Google search results</p>
      </CardContent>
    </Card>
  );
}

// ─── Open Graph Preview ───────────────────────────────────────────
function OpenGraphPreview({ brand }: { brand: Brand }) {
  const slug = brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-');
  const siteUrl = `mayasura.app/site/${slug}`;
  const description = brand.description || brand.tagline || `Welcome to ${brand.name}`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Share2 className="h-4 w-4 text-violet-600" />
          Social Share Preview (Open Graph)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-zinc-400 mb-3">
          This is how your site link looks when shared on social media (Facebook, Slack, Discord, etc.)
        </p>
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden max-w-md">
          {/* OG Image area */}
          <div
            className="aspect-[1.91/1] flex items-center justify-center relative"
            style={{ background: `linear-gradient(135deg, ${brand.primary_color}15, ${brand.accent_color}20)` }}
          >
            {brand.logo_url ? (
              <img src={brand.logo_url} alt="" className="max-h-[60%] max-w-[60%] object-contain" />
            ) : (
              <div className="text-center">
                <div
                  className="h-16 w-16 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold mb-3"
                  style={{ backgroundColor: brand.accent_color, color: '#fff' }}
                >
                  {brand.name.charAt(0)}
                </div>
                <p className="text-sm font-semibold" style={{ color: brand.primary_color }}>
                  {brand.name}
                </p>
              </div>
            )}
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider">{siteUrl}</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5">
              {brand.name}{brand.tagline ? ` — ${brand.tagline}` : ''}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Social Media Checklist ───────────────────────────────────────
function SocialChecklist({ brand, productCount, blogPostCount }: { brand: Brand; productCount: number; blogPostCount: number }) {
  const items = [
    {
      label: 'Brand name & tagline set',
      done: !!brand.name && !!brand.tagline,
      tip: 'Your name and tagline appear in social profiles',
      icon: FileText,
    },
    {
      label: 'Brand description written',
      done: !!brand.description,
      tip: 'Used as bio text across social platforms',
      icon: FileText,
    },
    {
      label: 'Logo/profile image uploaded',
      done: !!brand.logo_url,
      tip: 'Profile picture for all social accounts',
      icon: ImageIcon,
    },
    {
      label: 'At least 3 products or services',
      done: productCount >= 3,
      tip: 'Content to showcase on social posts',
      icon: Users,
    },
    {
      label: 'Industry/category selected',
      done: !!brand.industry,
      tip: 'Helps with hashtag strategy',
      icon: Hash,
    },
    {
      label: 'Brand voice defined',
      done: !!brand.brand_voice,
      tip: 'Ensures consistent tone across platforms',
      icon: Sparkles,
    },
    {
      label: 'Blog posts published (for content sharing)',
      done: blogPostCount >= 1,
      tip: 'Blog posts make great social content',
      icon: FileText,
    },
    {
      label: 'Site launched (live URL for sharing)',
      done: brand.status === 'launched',
      tip: 'Social links need a live destination',
      icon: Globe,
    },
  ];

  const completed = items.filter(i => i.done).length;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Social Media Readiness
          </span>
          <Badge variant={pct >= 80 ? 'success' : pct >= 50 ? 'secondary' : 'destructive'}>
            {completed}/{items.length} ({pct}%)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${item.done ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'bg-zinc-50 dark:bg-zinc-800/30'}`}
            >
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-zinc-300 dark:text-zinc-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${item.done ? 'text-zinc-500 line-through' : 'text-zinc-700 dark:text-zinc-300 font-medium'}`}>
                  {item.label}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{item.tip}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {pct === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-center"
          >
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              🎉 You&apos;re social media ready! Time to launch your presence.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function SocialPreviewPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const toast = useToast();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [blogPostCount, setBlogPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [socialPosts, setSocialPosts] = useState<Array<{
    platform: string;
    platformLabel: string;
    content: string;
    hashtags: string[];
    bestTime: string;
    tip: string;
  }> | null>(null);

  useEffect(() => {
    const safeFetch = (url: string, fallback: unknown = null) =>
      fetch(url).then(r => { if (!r.ok) throw new Error(); return r.json(); }).catch(() => fallback);

    Promise.all([
      safeFetch(`/api/brands/${brandId}`, { brand: null }),
      safeFetch(`/api/brands/${brandId}/products`, { products: [] }),
      safeFetch(`/api/brands/${brandId}/blog`, { posts: [] }),
    ]).then(([brandData, productData, blogData]) => {
      if (brandData?.brand) setBrand(brandData.brand);
      setProductCount(productData?.products?.length || 0);
      setBlogPostCount(blogData?.posts?.length || 0);
      setLoading(false);
    });
  }, [brandId]);

  const handleGeneratePosts = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/social-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSocialPosts(data.posts || []);
      toast.success('Social posts generated! ✨');
    } catch {
      toast.error('Failed to generate social posts');
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !brand) {
    return (
      <div className="p-4 sm:p-8 max-w-6xl mx-auto animate-pulse">
        <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const platformIcons: Record<string, { icon: typeof Twitter; color: string; bg: string }> = {
    twitter: { icon: Twitter, color: 'text-zinc-900 dark:text-white', bg: 'bg-zinc-100 dark:bg-zinc-800' },
    instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    linkedin: { icon: Linkedin, color: 'text-[#0A66C2]', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    facebook: { icon: Globe, color: 'text-[#1877F2]', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  };

  return (
    <PageTransition>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Brand', href: `/dashboard/${brandId}` },
            { label: 'Social Preview' },
          ]}
          className="mb-4"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Share2 className="h-6 w-6 text-violet-600" />
              Social Media Preview
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              See how your brand looks across social platforms
            </p>
          </div>
          <Button size="sm" onClick={handleGeneratePosts} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
            Generate Sample Posts
          </Button>
        </motion.div>

        {/* Platform Previews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <TwitterPreview brand={brand} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <InstagramPreview brand={brand} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <LinkedInPreview brand={brand} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GoogleSerpPreview brand={brand} />
          </motion.div>
        </div>

        {/* Open Graph Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
          <OpenGraphPreview brand={brand} />
        </motion.div>

        {/* AI Generated Posts */}
        {socialPosts && socialPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              AI-Generated Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialPosts.map((post, i) => {
                const pi = platformIcons[post.platform] || platformIcons.twitter;
                const Icon = pi.icon;
                return (
                  <motion.div
                    key={`${post.platform}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${pi.bg}`}>
                            <Icon className={`h-3.5 w-3.5 ${pi.color}`} />
                          </div>
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white">{post.platformLabel}</span>
                          <Badge variant="secondary" className="text-[10px] ml-auto">{post.bestTime}</Badge>
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line mb-3">
                          {post.content}
                        </p>
                        {post.hashtags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.hashtags.map(tag => (
                              <span key={tag} className="text-xs text-violet-500 dark:text-violet-400">{tag}</span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-zinc-400 italic">💡 {post.tip}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Social Media Checklist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SocialChecklist brand={brand} productCount={productCount} blogPostCount={blogPostCount} />
        </motion.div>
      </div>
    </PageTransition>
  );
}
