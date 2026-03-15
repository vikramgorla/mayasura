"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandScore } from "@/components/dashboard/brand-score";
import {
  Package,
  BookOpen,
  Palette,
  ExternalLink,
  ShoppingCart,
  Eye,
  Plus,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
} from "lucide-react";

interface BrandDetail {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  status: string;
  createdAt: string;
}

interface StatsData {
  products: number;
  orders: number;
  pageViews: number;
  prevPageViews: number;
  subscribers: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const ACTIVITY_EMOJIS: Record<string, string> = {
  brand_created: "🎉",
  product_added: "📦",
  blog_published: "📝",
  order_placed: "🛒",
  subscriber_added: "📧",
  testimonial_added: "⭐",
  design_updated: "🎨",
};

export default function BrandOverviewPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<BrandDetail | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [brandRes, analyticsRes, productsRes, ordersRes, subscribersRes, activitiesRes] =
          await Promise.allSettled([
            fetch(`/api/v1/brands/${brandId}`),
            fetch(`/api/v1/brands/${brandId}/analytics?days=30`),
            fetch(`/api/v1/brands/${brandId}/products`),
            fetch(`/api/v1/brands/${brandId}/orders`),
            fetch(`/api/v1/brands/${brandId}/subscribers`),
            fetch(`/api/v1/brands/${brandId}/activities`),
          ]);

        // Brand
        if (brandRes.status === "fulfilled" && brandRes.value.ok) {
          const json = await brandRes.value.json();
          setBrand(json.data);
        }

        let pageViews = 0;
        let prevPageViews = 0;
        if (analyticsRes.status === "fulfilled" && analyticsRes.value.ok) {
          const json = await analyticsRes.value.json();
          pageViews = json.data?.total ?? 0;
          prevPageViews = json.data?.prevTotal ?? 0;
        }

        let productCount = 0;
        if (productsRes.status === "fulfilled" && productsRes.value.ok) {
          const json = await productsRes.value.json();
          productCount = (json.data || []).length;
        }

        let orderCount = 0;
        if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
          const json = await ordersRes.value.json();
          orderCount = (json.data || []).length;
        }

        let subscriberCount = 0;
        if (subscribersRes.status === "fulfilled" && subscribersRes.value.ok) {
          const json = await subscribersRes.value.json();
          subscriberCount = (json.data || []).filter(
            (s: { status: string }) => s.status === "active"
          ).length;
        }

        setStats({
          products: productCount,
          orders: orderCount,
          pageViews,
          prevPageViews,
          subscribers: subscriberCount,
        });

        // Activities
        if (activitiesRes.status === "fulfilled" && activitiesRes.value.ok) {
          const json = await activitiesRes.value.json();
          setActivities((json.data || []).slice(0, 5));
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [brandId]);

  if (loading) return <OverviewSkeleton />;
  if (!brand) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-secondary)]">Brand not found</p>
      </div>
    );
  }

  const pvTrend = stats
    ? stats.prevPageViews > 0
      ? ((stats.pageViews - stats.prevPageViews) / stats.prevPageViews) * 100
      : stats.pageViews > 0
        ? 100
        : 0
    : 0;

  const statCards = [
    { label: "Products", value: stats?.products ?? 0, icon: Package, href: `/dashboard/${brandId}/products` },
    { label: "Orders", value: stats?.orders ?? 0, icon: ShoppingCart, href: `/dashboard/${brandId}/orders` },
    { label: "Page Views (30d)", value: stats?.pageViews ?? 0, icon: Eye, trend: pvTrend, href: `/dashboard/${brandId}/analytics` },
    { label: "Subscribers", value: stats?.subscribers ?? 0, icon: Users, href: `/dashboard/${brandId}/subscribers` },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 p-6 text-white">
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {getGreeting()} 👋
        </h1>
        <p className="text-violet-100 mt-1 text-sm">
          Welcome to <strong>{brand.name}</strong>. Here&apos;s your brand at a glance.
        </p>
        <div className="flex items-center gap-3 mt-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {brand.status}
          </Badge>
          <Link
            href={`/site/${brand.slug}`}
            target="_blank"
            className="flex items-center gap-1 text-sm text-violet-100 hover:text-white transition-colors"
          >
            View Site <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Stats + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 hover:shadow-[var(--shadow-md)] hover:border-[var(--accent)] transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)]" />
                <span className="text-xs text-[var(--text-tertiary)]">{stat.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value.toLocaleString()}
                </p>
                {"trend" in stat && stat.trend !== undefined && (
                  <TrendBadge value={stat.trend} />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Brand Score */}
        <BrandScore />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Add Product", desc: "List a new product or service", icon: Plus, href: `/dashboard/${brandId}/products` },
            { label: "Write Blog", desc: "Create a new blog post", icon: BookOpen, href: `/dashboard/${brandId}/blog` },
            { label: "Customize Design", desc: "Adjust your brand's look", icon: Palette, href: `/dashboard/${brandId}/design` },
            { label: "View Site", desc: "See your live consumer site", icon: ExternalLink, href: `/site/${brand.slug}`, external: true },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={"external" in action ? "_blank" : undefined}
              className="flex items-start gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 hover:shadow-[var(--shadow-md)] hover:border-[var(--accent)] transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-light)] transition-colors">
                <action.icon className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)]">{action.label}</h4>
                <p className="text-xs text-[var(--text-tertiary)]">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-8 w-8 text-[var(--text-tertiary)] mb-2" />
            <p className="text-sm text-[var(--text-secondary)]">No activity yet. Start building your brand!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <span className="text-lg shrink-0">{ACTIVITY_EMOJIS[a.type] || "📌"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">{a.description}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{timeAgo(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TrendBadge({ value }: { value: number }) {
  if (Math.abs(value) < 0.5) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-[var(--text-tertiary)]">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }
  const positive = value > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs ${positive ? "text-green-500" : "text-red-500"}`}>
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? "+" : ""}{Math.round(value)}%
    </span>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl">
      <Skeleton className="h-32 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
    </div>
  );
}
