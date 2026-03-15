import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands, products } from "@/lib/db/schema";
import { getTemplate } from "@/lib/templates/website-templates";
import { ProductDetailClient } from "./product-detail-client";

interface PageProps {
  params: Promise<{ slug: string; productId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, productId } = await params;
  const brand = db.select().from(brands).where(eq(brands.slug, slug)).get();
  if (!brand) return {};

  const product = db
    .select()
    .from(products)
    .where(and(eq(products.id, productId), eq(products.brandId, brand.id)))
    .get();

  if (!product) return {};

  return {
    title: `${product.name} — ${brand.name}`,
    description: product.description || `Shop ${product.name} from ${brand.name}`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, productId } = await params;
  const brand = db.select().from(brands).where(eq(brands.slug, slug)).get();

  if (!brand || brand.status !== "launched") notFound();

  const product = db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.brandId, brand.id),
        eq(products.status, "active")
      )
    )
    .get();

  if (!product) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  return (
    <ProductDetailClient
      slug={slug}
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        imageUrl: product.imageUrl,
        category: product.category,
      }}
      accentColor={accentColor}
      templateId={templateId}
    />
  );
}
