"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { DesignStudioContent } from "./design-studio-content";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontHeading: string | null;
  fontBody: string | null;
  websiteTemplate: string | null;
}

export default function DesignStudioPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrand = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}`);
      if (!res.ok) throw new Error("Failed to load brand");
      const json = await res.json();
      setBrand(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load brand");
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  if (loading) return <DesignStudioSkeleton />;

  if (error || !brand) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-2">⚠️</p>
        <p className="text-[var(--text-primary)] font-medium">
          {error || "Brand not found"}
        </p>
      </div>
    );
  }

  return <DesignStudioContent brand={brand} />;
}

function DesignStudioSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );
}
