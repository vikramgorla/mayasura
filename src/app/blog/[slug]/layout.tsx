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
import { BlogLayoutClient } from "./blog-layout-client";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function BlogLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const colors = template.colors.light;
  const accentColor = brand.accentColor || colors.accent;
  const secondaryColor = brand.secondaryColor || colors.background;
  const fontHeading = brand.fontHeading || template.fonts.heading;
  const fontBody = brand.fontBody || template.fonts.body;

  const fontsUrl = buildGoogleFontsUrl(fontHeading, fontBody);

  const designSettings: DesignSettings = {
    primaryColor: brand.primaryColor || colors.text,
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

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={fontsUrl} />

      <div
        style={{
          ...styleVars,
          backgroundColor: secondaryColor,
          color: colors.text,
          fontFamily: getFontFamily(fontBody),
          minHeight: "100vh",
        } as React.CSSProperties}
      >
        <BlogLayoutClient
          brandName={brand.name}
          slug={slug}
          accentColor={accentColor}
        >
          {children}
        </BlogLayoutClient>
      </div>
    </>
  );
}
