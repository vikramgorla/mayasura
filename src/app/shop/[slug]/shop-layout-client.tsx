"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CartProvider, useCart } from "@/components/shop/cart-provider";

interface ShopLayoutClientProps {
  brandName: string;
  slug: string;
  accentColor: string;
  templateId: string;
  children: React.ReactNode;
}

function ShopNav({
  brandName,
  slug,
  accentColor,
}: {
  brandName: string;
  slug: string;
  accentColor: string;
}) {
  const { itemCount } = useCart();

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg border-b"
      style={{
        backgroundColor: "rgba(var(--brand-bg-rgb), 0.85)",
        borderColor: "var(--brand-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href={`/shop/${slug}`}
          className="font-semibold text-lg"
          style={{
            fontFamily: "var(--brand-font-heading)",
            color: "var(--brand-text)",
          }}
        >
          {brandName}
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={`/shop/${slug}`}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--brand-text)" }}
          >
            Shop
          </Link>
          <Link
            href={`/site/${slug}`}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--brand-muted)" }}
          >
            Website
          </Link>
          <Link
            href={`/shop/${slug}/cart`}
            className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:opacity-80"
            style={{
              color: "var(--brand-text)",
            }}
            aria-label={`Cart with ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: accentColor,
                  color: "var(--brand-accent-text)",
                }}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function ShopLayoutClient({
  brandName,
  slug,
  accentColor,
  children,
}: ShopLayoutClientProps) {
  return (
    <CartProvider slug={slug}>
      <ShopNav
        brandName={brandName}
        slug={slug}
        accentColor={accentColor}
      />
      <main className="min-h-[calc(100vh-56px)]">{children}</main>
      <footer
        className="border-t py-8 text-center text-sm"
        style={{
          borderColor: "var(--brand-border)",
          color: "var(--brand-muted)",
        }}
      >
        <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
      </footer>
    </CartProvider>
  );
}
