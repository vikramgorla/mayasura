import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import { generateBrandMetadata } from "@/components/seo/meta-tags";
import { ContactClient } from "./contact-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);
  if (!brand) return {};
  return generateBrandMetadata(brand, {
    title: "Contact",
    description: `Get in touch with ${brand.name}`,
    path: "/contact",
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  return (
    <ContactClient
      brand={{
        name: brand.name,
        slug: brand.slug,
        accentColor,
      }}
      templateId={templateId}
    />
  );
}
