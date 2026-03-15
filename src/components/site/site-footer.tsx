"use client";

import { useState } from "react";
import Link from "next/link";

interface SiteFooterProps {
  brandName: string;
  slug: string;
  fontBody: string;
  accentColor: string;
}

export function SiteFooter({
  brandName,
  slug,
  fontBody,
  accentColor,
}: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const basePath = `/site/${slug}`;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch(`/api/v1/public/brand/${slug}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--brand-border)",
        backgroundColor: "var(--brand-surface)",
        color: "var(--brand-text)",
        fontFamily: `"${fontBody}", system-ui, sans-serif`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-semibold text-lg mb-2">{brandName}</h3>
            <p className="text-sm opacity-60">
              Built with Mayasura — the digital palace builder.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider opacity-60">
              Pages
            </h4>
            <div className="space-y-2">
              {[
                { label: "Home", href: "" },
                { label: "Products", href: "/products" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={`${basePath}${link.href}`}
                  className="block text-sm opacity-70 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider opacity-60">
              Newsletter
            </h4>
            {status === "success" ? (
              <p className="text-sm" style={{ color: accentColor }}>
                Thanks for subscribing! 🎉
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-3 py-2 text-sm rounded border outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--brand-border)",
                    backgroundColor: "var(--brand-surface)",
                    color: "var(--brand-text)",
                    // @ts-expect-error CSS custom property in focus ring
                    "--tw-ring-color": accentColor,
                    fontSize: "16px", // Prevent iOS zoom
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-4 py-2 text-sm font-medium transition-transform active:scale-[0.98] disabled:opacity-50"
                  style={{
                    backgroundColor: accentColor,
                    color: "var(--brand-accent-text)",
                    borderRadius: "var(--brand-button-radius, 8px)",
                  }}
                >
                  {status === "loading" ? "..." : "Subscribe"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="text-sm mt-1 text-red-500">
                Something went wrong. Try again.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm opacity-50" style={{ borderColor: "var(--brand-border)" }}>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
