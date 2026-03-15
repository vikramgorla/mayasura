"use client";

import { useMemo } from "react";
import { getTemplate } from "@/lib/templates/website-templates";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { CookieConsent } from "@/components/site/cookie-consent";
import { NewsletterPopup } from "@/components/site/newsletter-popup";
import { PageViewTracker } from "@/components/site/page-view-tracker";

interface ClientBrand {
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
}

interface SiteLayoutClientProps {
  brand: ClientBrand;
  templateId: string;
  accentColor: string;
  children: React.ReactNode;
}

export function SiteLayoutClient({
  brand,
  templateId,
  accentColor,
  children,
}: SiteLayoutClientProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  if (!template) return <>{children}</>;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        style={{
          backgroundColor: accentColor,
          color: "var(--brand-accent-text)",
          outline: `2px solid ${accentColor}`,
          outlineOffset: "2px",
        }}
      >
        Skip to content
      </a>

      <SiteNav
        brandName={brand.name}
        slug={brand.slug}
        template={template}
        accentColor={accentColor}
        fontHeading={brand.fontHeading}
        fontBody={brand.fontBody}
      />

      <main id="main-content" role="main">
        {children}
      </main>

      <SiteFooter
        brandName={brand.name}
        slug={brand.slug}
        fontBody={brand.fontBody}
        accentColor={accentColor}
      />

      <CookieConsent accentColor={accentColor} fontBody={brand.fontBody} />
      <NewsletterPopup
        slug={brand.slug}
        brandName={brand.name}
        accentColor={accentColor}
        fontBody={brand.fontBody}
      />
      <PageViewTracker slug={brand.slug} />
    </>
  );
}
