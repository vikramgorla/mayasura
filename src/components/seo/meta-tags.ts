import type { Metadata } from "next";
import type { PublicBrandData } from "@/lib/db/queries/public-brand";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Generate metadata for a consumer brand page.
 */
export function generateBrandMetadata(
  brand: PublicBrandData,
  page?: { title?: string; description?: string; path?: string }
): Metadata {
  const title = page?.title
    ? `${page.title} — ${brand.name}`
    : `${brand.name}${brand.tagline ? ` — ${brand.tagline}` : ""}`;

  const description =
    page?.description ||
    brand.description ||
    brand.tagline ||
    `Welcome to ${brand.name}`;

  const url = `${BASE_URL}/site/${brand.slug}${page?.path || ""}`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: brand.name,
      type: "website",
      ...(brand.logoUrl ? { images: [{ url: brand.logoUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(brand.logoUrl ? { images: [brand.logoUrl] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
