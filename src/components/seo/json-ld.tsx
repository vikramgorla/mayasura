import type { PublicBrandData } from "@/lib/db/queries/public-brand";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface JsonLdProps {
  brand: PublicBrandData;
}

/**
 * Organization / LocalBusiness JSON-LD structured data.
 */
export function BrandJsonLd({ brand }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: `${BASE_URL}/site/${brand.slug}`,
    description: brand.description || brand.tagline || undefined,
    ...(brand.logoUrl ? { logo: brand.logoUrl } : {}),
    ...(brand.industry
      ? { industry: brand.industry }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
