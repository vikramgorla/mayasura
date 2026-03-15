import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import { OrderConfirmationClient } from "./order-confirmation-client";

interface PageProps {
  params: Promise<{ slug: string; orderId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);
  if (!brand) return {};
  return { title: `Order Confirmed — ${brand.name}` };
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { slug, orderId } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  return (
    <OrderConfirmationClient
      slug={slug}
      orderId={orderId}
      accentColor={accentColor}
    />
  );
}
