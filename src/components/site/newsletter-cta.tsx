"use client";

import { useState } from "react";

interface NewsletterCtaProps {
  slug: string;
  brandName: string;
  accentColor: string;
  borderRadius: string;
}

export function NewsletterCta({
  slug,
  brandName,
  accentColor,
  borderRadius,
}: NewsletterCtaProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
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
    <section
      style={{
        padding: `var(--brand-section-padding, 64px) 0`,
        background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)`,
      }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className="mb-2"
          style={{
            fontFamily: "var(--brand-font-heading)",
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 600,
            color: "var(--brand-text)",
          }}
        >
          Stay Updated
        </h2>
        <p
          className="mb-6"
          style={{
            fontFamily: "var(--brand-font-body)",
            color: "var(--brand-muted)",
            fontSize: "0.9375rem",
          }}
        >
          Get the latest from {brandName} delivered to your inbox.
        </p>

        {status === "success" ? (
          <p
            className="font-medium"
            style={{ color: accentColor }}
          >
            🎉 You&apos;re subscribed! Check your inbox.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 text-sm border outline-none focus:ring-2"
              style={{
                borderColor: "var(--brand-border)",
                backgroundColor: "var(--brand-surface)",
                color: "var(--brand-text)",
                borderRadius,
                fontSize: "16px",
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 text-sm font-medium transition-transform active:scale-[0.98] disabled:opacity-50"
              style={{
                backgroundColor: accentColor,
                color: "var(--brand-accent-text)",
                borderRadius,
              }}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-sm text-red-500 mt-2">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
