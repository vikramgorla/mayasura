"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  BookOpen,
  Palette,
  ExternalLink,
  ShoppingCart,
  Eye,
  Plus,
} from "lucide-react";
import { TEMPLATE_MAP } from "@/lib/templates/website-templates";

interface BrandDetail {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  industry: string | null;
  status: string;
  websiteTemplate: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontHeading: string | null;
  fontBody: string | null;
  channels: string[];
  createdAt: string;
}

export default function BrandOverviewPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<BrandDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`/api/v1/brands/${brandId}`);
        if (res.ok) {
          const json = await res.json();
          setBrand(json.data);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [brandId]);

  if (loading) {
    return <OverviewSkeleton />;
  }

  if (!brand) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-secondary)]">Brand not found</p>
      </div>
    );
  }

  const template = brand.websiteTemplate
    ? TEMPLATE_MAP.get(brand.websiteTemplate)
    : null;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {brand.name}
            </h1>
            <Badge
              variant={brand.status === "active" ? "default" : "secondary"}
            >
              {brand.status}
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-tertiary)] font-mono">
            /{brand.slug}
          </p>
          {brand.tagline && (
            <p className="text-[var(--text-secondary)]">{brand.tagline}</p>
          )}
        </div>
        <Link
          href={`/site/${brand.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"
        >
          View Site
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Products", value: "0", icon: Package },
          { label: "Orders", value: "0", icon: ShoppingCart },
          { label: "Page Views", value: "0", icon: Eye },
          {
            label: "Template",
            value: template?.name || "—",
            icon: Palette,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="h-4 w-4 text-[var(--text-tertiary)]" />
              <span className="text-xs text-[var(--text-tertiary)]">
                {stat.label}
              </span>
            </div>
            <p className="text-xl font-semibold text-[var(--text-primary)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Add Product",
              description: "List a new product or service",
              icon: Plus,
              href: `/dashboard/${brandId}/products`,
            },
            {
              label: "Write Blog",
              description: "Create a new blog post",
              icon: BookOpen,
              href: `/dashboard/${brandId}/blog`,
            },
            {
              label: "Customize Design",
              description: "Adjust your brand's look",
              icon: Palette,
              href: `/dashboard/${brandId}/design`,
            },
            {
              label: "View Site",
              description: "See your live consumer site",
              icon: ExternalLink,
              href: `/site/${brand.slug}`,
              external: true,
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              className="flex items-start gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 hover:shadow-[var(--shadow-md)] hover:border-[var(--accent)] transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-light)] transition-colors">
                <action.icon className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)]">
                  {action.label}
                </h4>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Brand Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Colors */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Brand Colors
          </h4>
          <div className="flex gap-3">
            {[
              { label: "Primary", color: brand.primaryColor },
              { label: "Secondary", color: brand.secondaryColor },
              { label: "Accent", color: brand.accentColor },
            ].map(
              ({ label, color }) =>
                color && (
                  <div key={label} className="text-center">
                    <div
                      className="h-10 w-10 rounded-lg border border-[var(--border-primary)]"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] text-[var(--text-tertiary)] mt-1 block">
                      {label}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                      {color}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Channels */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Active Channels
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {brand.channels.length > 0 ? (
              brand.channels.map((ch) => (
                <Badge key={ch} variant="secondary">
                  {ch}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-[var(--text-tertiary)]">
                No channels configured
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
