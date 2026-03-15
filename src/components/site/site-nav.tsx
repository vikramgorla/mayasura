"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag } from "lucide-react";
import type { WebsiteTemplate } from "@/lib/templates/website-templates";

interface SiteNavProps {
  brandName: string;
  slug: string;
  template: WebsiteTemplate;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
}

const NAV_LINKS = [
  { label: "Home", href: "" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteNav({
  brandName,
  slug,
  template,
  accentColor,
  fontHeading,
  fontBody,
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const basePath = `/site/${slug}`;
  const preview = template.preview;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = [
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    scrolled
      ? "backdrop-blur-[16px] saturate-[180%] border-b"
      : "bg-transparent",
  ].join(" ");

  return (
    <>
      <nav
        className={navClasses}
        style={{
          borderColor: scrolled ? "var(--brand-border)" : "transparent",
          backgroundColor: scrolled
            ? "rgba(var(--brand-bg-rgb, 255,255,255), 0.85)"
            : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Name */}
            <Link
              href={basePath}
              style={{
                fontFamily: `"${fontHeading}", system-ui, sans-serif`,
                fontWeight: preview.typography.headingWeight,
                letterSpacing:
                  preview.navStyle === "centered" ||
                  preview.navStyle === "playful"
                    ? "0.04em"
                    : "-0.02em",
                textTransform:
                  preview.typography.headingCase === "uppercase"
                    ? "uppercase"
                    : "none",
                fontSize: "1.125rem",
                color: "var(--brand-text)",
              }}
            >
              {brandName}
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={`${basePath}${link.href}`}
                  className="transition-opacity hover:opacity-100"
                  style={{
                    fontFamily: `"${fontBody}", system-ui, sans-serif`,
                    fontSize: "0.875rem",
                    opacity: 0.7,
                    color: "var(--brand-text)",
                    letterSpacing:
                      preview.navStyle === "spread" ? "0.05em" : "normal",
                    textTransform:
                      preview.navStyle === "spread" ? "uppercase" : "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* CTA Button */}
              <Link
                href={`${basePath}/products`}
                className="inline-flex items-center gap-2 transition-transform active:scale-[0.98]"
                style={{
                  fontFamily: `"${fontBody}", system-ui, sans-serif`,
                  fontSize: "var(--brand-button-font-size, 14px)",
                  fontWeight: 500,
                  backgroundColor: accentColor,
                  color: "var(--brand-accent-text)",
                  padding: `var(--brand-button-py, 10px) var(--brand-button-px, 20px)`,
                  borderRadius: `var(--brand-button-radius, ${preview.borderRadius})`,
                }}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Shop
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2"
              style={{ color: "var(--brand-text)", minHeight: "44px", minWidth: "44px" }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{
              borderColor: "var(--brand-border)",
              backgroundColor: "var(--brand-surface)",
            }}
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={`${basePath}${link.href}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 transition-opacity hover:opacity-100"
                  style={{
                    fontFamily: `"${fontBody}", system-ui, sans-serif`,
                    fontSize: "1rem",
                    color: "var(--brand-text)",
                    minHeight: "44px",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`${basePath}/products`}
                onClick={() => setMenuOpen(false)}
                className="block text-center py-3 mt-2 transition-transform active:scale-[0.98]"
                style={{
                  fontFamily: `"${fontBody}", system-ui, sans-serif`,
                  fontSize: "1rem",
                  fontWeight: 500,
                  backgroundColor: accentColor,
                  color: "var(--brand-accent-text)",
                  borderRadius: `var(--brand-button-radius, ${preview.borderRadius})`,
                  minHeight: "44px",
                }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14 sm:h-16" />
    </>
  );
}
