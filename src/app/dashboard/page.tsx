"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Calendar,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import { TEMPLATE_MAP } from "@/lib/templates/website-templates";

interface Brand {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  industry: string | null;
  status: string;
  websiteTemplate: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch("/api/v1/brands");
        if (!res.ok) throw new Error("Failed to load brands");
        const json = await res.json();
        setBrands(json.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Brands
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage your digital palaces
            </p>
          </div>
          <Link href="/create">
            <Button variant="brand">
              <Plus className="h-4 w-4 mr-2" />
              Create Brand
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 mb-6 dark:border-red-800 dark:bg-red-950">
            <AlertCircle className="h-5 w-5 text-[var(--error)]" />
            <p className="text-sm text-[var(--error)]">{error}</p>
          </div>
        )}

        {brands.length === 0 && !error ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  const template = brand.websiteTemplate
    ? TEMPLATE_MAP.get(brand.websiteTemplate)
    : null;

  const date = new Date(brand.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/dashboard/${brand.id}`}>
      <div className="rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all cursor-pointer group">
        {/* Accent bar */}
        <div
          className="h-1.5 rounded-t-[var(--card-radius)]"
          style={{
            backgroundColor: brand.accentColor || "var(--accent)",
          }}
        />

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                {brand.name}
              </h3>
              {brand.tagline && (
                <p className="text-sm text-[var(--text-secondary)] truncate mt-0.5">
                  {brand.tagline}
                </p>
              )}
            </div>
            <Badge
              variant={
                brand.status === "active" ? "default" : "secondary"
              }
              className="shrink-0 ml-2"
            >
              {brand.status}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
            {template && (
              <span className="flex items-center gap-1">
                <LayoutGrid className="h-3 w-3" />
                {template.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date}
            </span>
          </div>

          {brand.industry && (
            <Badge variant="outline" className="text-[10px]">
              {brand.industry}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">🏛️</div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        No palaces yet
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-sm">
        Create your first brand to start building your digital palace.
        It only takes a few minutes.
      </p>
      <Link href="/create" className="mt-6">
        <Button variant="brand" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Brand
        </Button>
      </Link>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
