"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Copy, Check, Sparkles, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Brand {
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  accentColor: string | null;
}

interface GeneratedPost {
  platform: string;
  content: string;
  hashtags: string[];
}

export default function SocialPreviewPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [editedPosts, setEditedPosts] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`/api/v1/brands/${brandId}`);
        if (res.ok) {
          const json = await res.json();
          setBrand(json.data);
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [brandId]);

  const generatePosts = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/social-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms: ["twitter", "instagram", "linkedin"] }),
      });
      if (res.ok) {
        const json = await res.json();
        setPosts(json.data.posts || []);
        setEditedPosts({});
      }
    } catch { /* silent */ } finally {
      setGenerating(false);
    }
  }, [brandId]);

  async function copyToClipboard(platform: string) {
    const text = editedPosts[platform] || posts.find((p) => p.platform === platform)?.content || "";
    await navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) return <SocialSkeleton />;
  if (!brand) return <p className="text-[var(--text-secondary)]">Brand not found</p>;

  const initial = brand.name.charAt(0).toUpperCase();
  const accent = brand.accentColor || "#5B21B6";
  const desc = brand.description || brand.tagline || "Your brand description";
  const siteUrl = `mayasura.com/site/${brand.slug}`;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Social Preview</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            See how your brand appears across platforms
          </p>
        </div>
        <Button variant="brand" size="sm" onClick={generatePosts} disabled={generating}>
          {generating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
          {generating ? "Generating..." : "AI Generate Posts"}
        </Button>
      </div>

      {/* Platform Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TwitterPreview name={brand.name} initial={initial} desc={desc} accent={accent} siteUrl={siteUrl} />
        <InstagramPreview name={brand.name} initial={initial} accent={accent} tagline={brand.tagline} />
        <LinkedInPreview name={brand.name} desc={desc} accent={accent} />
        <GoogleSerpPreview name={brand.name} desc={desc} siteUrl={siteUrl} />
      </div>

      {/* Generated Posts */}
      {posts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Generated Posts</h2>
          {posts.map((post) => (
            <div key={post.platform} className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[var(--text-primary)] capitalize">{post.platform}</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(post.platform)}>
                  {copied === post.platform ? <Check className="h-3.5 w-3.5 mr-1 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied === post.platform ? "Copied!" : "Copy"}
                </Button>
              </div>
              <textarea
                value={editedPosts[post.platform] ?? post.content}
                onChange={(e) => setEditedPosts((prev) => ({ ...prev, [post.platform]: e.target.value }))}
                className="w-full min-h-[100px] text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg p-3 text-[var(--text-primary)] resize-y focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              />
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.hashtags.map((tag) => (
                    <span key={tag} className="text-xs text-[var(--accent)]">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TwitterPreview({ name, initial, desc, accent, siteUrl }: { name: string; initial: string; desc: string; accent: string; siteUrl: string }) {
  return (
    <PreviewCard title="Twitter / X">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold" style={{ backgroundColor: accent }}>{initial}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-[var(--text-primary)]">{name}</span>
            <span className="text-sm text-[var(--text-tertiary)]">@{name.toLowerCase().replace(/\s+/g, "")}</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] mt-1">{desc.slice(0, 200)}</p>
          <div className="mt-2 rounded-xl border border-[var(--border-primary)] overflow-hidden">
            <div className="h-24 flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
              <Globe className="h-8 w-8" style={{ color: accent }} />
            </div>
            <div className="p-3">
              <p className="text-xs text-[var(--text-tertiary)]">{siteUrl}</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">{name}</p>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{desc.slice(0, 100)}</p>
            </div>
          </div>
        </div>
      </div>
    </PreviewCard>
  );
}

function InstagramPreview({ name, initial, accent, tagline }: { name: string; initial: string; accent: string; tagline: string | null }) {
  return (
    <PreviewCard title="Instagram">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-full shrink-0 flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: accent }}>{initial}</div>
        <div className="flex-1 grid grid-cols-3 text-center">
          {[{ label: "Posts", val: "—" }, { label: "Followers", val: "—" }, { label: "Following", val: "—" }].map((s) => (
            <div key={s.label}>
              <p className="text-sm font-bold text-[var(--text-primary)]">{s.val}</p>
              <p className="text-xs text-[var(--text-secondary)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{name}</p>
      {tagline && <p className="text-sm text-[var(--text-secondary)]">{tagline}</p>}
      <div className="grid grid-cols-3 gap-0.5 mt-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square rounded bg-[var(--bg-secondary)] flex items-center justify-center">
            <Globe className="h-6 w-6 text-[var(--text-tertiary)]" />
          </div>
        ))}
      </div>
    </PreviewCard>
  );
}

function LinkedInPreview({ name, desc, accent }: { name: string; desc: string; accent: string }) {
  return (
    <PreviewCard title="LinkedIn">
      <div className="h-16 rounded-t-lg -mx-4 -mt-4 mb-3" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }} />
      <div className="flex items-start gap-3 -mt-8 mb-3">
        <div className="h-14 w-14 rounded-lg bg-white dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 flex items-center justify-center text-lg font-bold shadow-sm" style={{ color: accent }}>
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
      <h3 className="text-base font-bold text-[var(--text-primary)]">{name}</h3>
      <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-3">{desc}</p>
      <div className="flex gap-4 mt-3 text-xs text-[var(--text-tertiary)]">
        <span>— followers</span>
        <span>— employees</span>
      </div>
    </PreviewCard>
  );
}

function GoogleSerpPreview({ name, desc, siteUrl }: { name: string; desc: string; siteUrl: string }) {
  const title = `${name} — Official Website`;
  const truncTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
  const truncDesc = desc.length > 160 ? desc.slice(0, 157) + "..." : desc;

  return (
    <PreviewCard title="Google Search">
      <div>
        <p className="text-sm text-[var(--text-tertiary)]">{siteUrl}</p>
        <h3 className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-default">{truncTitle}</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{truncDesc}</p>
        <div className="flex gap-4 mt-1 text-xs text-[var(--text-tertiary)]">
          <span>Title: {title.length}/60</span>
          <span>Description: {desc.length}/160</span>
        </div>
      </div>
    </PreviewCard>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-4 py-2 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SocialSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
      </div>
    </div>
  );
}
