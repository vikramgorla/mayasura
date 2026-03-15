import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import {
  buildGoogleFontsUrl,
  getFontFamily,
  getTextOnColor,
} from "@/lib/templates/font-utils";
import {
  designSettingsToCSSVars,
  type DesignSettings,
} from "@/lib/templates/design-utils";
import { BrandJsonLd } from "@/components/seo/json-ld";
import { SiteLayoutClient } from "./site-layout-client";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);

  if (!template) {
    notFound();
  }

  // Resolve colors — brand overrides trump template defaults
  const colors = template.colors.light;
  const primaryColor = brand.primaryColor || colors.text;
  const secondaryColor = brand.secondaryColor || colors.background;
  const accentColor = brand.accentColor || colors.accent;
  const fontHeading = brand.fontHeading || template.fonts.heading;
  const fontBody = brand.fontBody || template.fonts.body;

  const fontsUrl = buildGoogleFontsUrl(fontHeading, fontBody);

  // Build CSS custom properties
  const designSettings: DesignSettings = {
    primaryColor,
    secondaryColor,
    accentColor,
    textColor: colors.text,
    mutedColor: colors.muted,
    surfaceColor: colors.surface,
    borderColor: colors.border,
    borderRadius: template.preview.borderRadius,
    spacingDensity: template.preview.spacing,
  };

  const cssVars = designSettingsToCSSVars(designSettings);
  const accentText = getTextOnColor(accentColor);

  // Convert hex background to RGB for frosted glass nav
  const bgHex = secondaryColor.replace("#", "");
  const bgR = parseInt(bgHex.slice(0, 2), 16);
  const bgG = parseInt(bgHex.slice(2, 4), 16);
  const bgB = parseInt(bgHex.slice(4, 6), 16);

  const styleVars: Record<string, string> = {
    ...cssVars,
    "--brand-accent-text": accentText,
    "--brand-text": colors.text,
    "--brand-muted": colors.muted,
    "--brand-surface": colors.surface,
    "--brand-border": colors.border,
    "--brand-bg-rgb": `${bgR},${bgG},${bgB}`,
    "--brand-font-heading": getFontFamily(fontHeading),
    "--brand-font-body": getFontFamily(fontBody),
  };

  // Serialize brand data for client components
  const clientBrand = {
    name: brand.name,
    slug: brand.slug,
    tagline: brand.tagline,
    description: brand.description,
    accentColor,
    fontHeading,
    fontBody,
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontsUrl} />

      <BrandJsonLd brand={brand} />

      <div
        style={{
          ...styleVars,
          backgroundColor: secondaryColor,
          color: colors.text,
          fontFamily: getFontFamily(fontBody),
          minHeight: "100vh",
        } as React.CSSProperties}
      >
        {brand.customCss && (
          <style dangerouslySetInnerHTML={{ __html: brand.customCss }} />
        )}

        <SiteLayoutClient
          brand={clientBrand}
          templateId={templateId}
          accentColor={accentColor}
        >
          {children}
        </SiteLayoutClient>
      </div>
    </>
  );
}
