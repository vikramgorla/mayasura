import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import { CheckoutClient } from "./checkout-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);
  if (!brand) return {};
  return { title: `Checkout — ${brand.name}` };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  return <CheckoutClient slug={slug} accentColor={accentColor} />;
}
