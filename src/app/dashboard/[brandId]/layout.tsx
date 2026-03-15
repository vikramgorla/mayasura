"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BookOpen,
  Palette,
  BarChart3,
  MessageCircle,
  Share2,
  Headphones,
  Star,
  MessageSquare,
  Percent,
  Settings,
  ArrowLeft,
} from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  status: string;
  accentColor: string | null;
}

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "" },
  { label: "Products", icon: Package, href: "/products" },
  { label: "Orders", icon: ShoppingCart, href: "/orders" },
  { label: "Blog", icon: BookOpen, href: "/blog" },
  { label: "Design Studio", icon: Palette, href: "/design" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Chatbot", icon: MessageCircle, href: "/chatbot" },
  { label: "Social", icon: Share2, href: "/social" },
  { label: "Support", icon: Headphones, href: "/support" },
  { label: "Testimonials", icon: Star, href: "/testimonials" },
  { label: "Reviews", icon: MessageSquare, href: "/reviews" },
  { label: "Discounts", icon: Percent, href: "/discounts" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function BrandDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const brandId = params.brandId as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrand() {
      try {
        const res = await fetch(`/api/v1/brands/${brandId}`);
        if (res.ok) {
          const json = await res.json();
          setBrand(json.data);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchBrand();
  }, [brandId]);

  const basePath = `/dashboard/${brandId}`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <aside className="w-[var(--sidebar-width)] shrink-0 border-r border-[var(--border-primary)] bg-[var(--bg-surface)] hidden lg:block">
        <div className="p-4 border-b border-[var(--border-primary)]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Brands
          </Link>
          {loading ? (
            <Skeleton className="h-6 w-32" />
          ) : brand ? (
            <div>
              <h2 className="font-semibold text-[var(--text-primary)] truncate">
                {brand.name}
              </h2>
              <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">
                /{brand.slug}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)]">Brand not found</p>
          )}
        </div>

        <nav className="p-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const href = `${basePath}${item.href}`;
            const isActive =
              item.href === ""
                ? pathname === basePath
                : pathname.startsWith(href);

            return (
              <Link
                key={item.label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden border-b border-[var(--border-primary)] bg-[var(--bg-surface)] px-4 py-3 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          {brand && (
            <h2 className="font-semibold text-[var(--text-primary)] truncate">
              {brand.name}
            </h2>
          )}
        </div>

        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
