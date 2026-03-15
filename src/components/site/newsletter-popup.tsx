"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface NewsletterPopupProps {
  slug: string;
  brandName: string;
  accentColor: string;
  fontBody: string;
}

export function NewsletterPopup({
  slug,
  brandName,
  accentColor,
  fontBody,
}: NewsletterPopupProps) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const dismissed = localStorage.getItem(`mayasura-newsletter-${slug}`);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 30000); // 30 second delay

    return () => clearTimeout(timer);
  }, [slug]);

  const handleClose = () => {
    localStorage.setItem(`mayasura-newsletter-${slug}`, "dismissed");
    setVisible(false);
  };

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
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className="relative w-full max-w-md rounded-xl p-6 shadow-xl"
        style={{
          backgroundColor: "var(--brand-surface)",
          color: "var(--brand-text)",
          fontFamily: `"${fontBody}", system-ui, sans-serif`,
          border: "1px solid var(--brand-border)",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 opacity-60 hover:opacity-100 transition-opacity"
          style={{ minHeight: "44px", minWidth: "44px" }}
          aria-label="Close newsletter popup"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold">You&apos;re subscribed!</p>
            <p className="text-sm opacity-60 mt-1">
              Thanks for joining the {brandName} community.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2">
              Stay in the loop
            </h3>
            <p className="text-sm opacity-60 mb-4">
              Get the latest updates from {brandName} delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 text-sm rounded-lg border outline-none focus:ring-2"
                style={{
                  borderColor: "var(--brand-border)",
                  backgroundColor: "var(--brand-surface)",
                  color: "var(--brand-text)",
                  fontSize: "16px",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-4 py-3 text-sm font-medium rounded-lg transition-transform active:scale-[0.98] disabled:opacity-50"
                style={{
                  backgroundColor: accentColor,
                  color: "var(--brand-accent-text)",
                }}
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-sm text-red-500 mt-2">
                Something went wrong. Please try again.
              </p>
            )}

            <p className="text-xs opacity-40 mt-3 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
