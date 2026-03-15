import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import { generateBrandMetadata } from "@/components/seo/meta-tags";
import { ProductsClient } from "./products-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);
  if (!brand) return {};
  return generateBrandMetadata(brand, {
    title: "Products",
    description: `Browse products from ${brand.name}`,
    path: "/products",
  });
}

export default async function ProductsPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  return (
    <ProductsClient
      brand={{
        name: brand.name,
        accentColor,
      }}
      products={brand.products}
      templateId={templateId}
    />
  );
}
