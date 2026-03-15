"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

interface ReviewFormProps {
  slug: string;
  productId: string;
  accentColor: string;
  onSubmitted: () => void;
}

export function ReviewForm({
  slug,
  productId,
  accentColor,
  onSubmitted,
}: ReviewFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        `/api/v1/public/brand/${slug}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorName: name,
            authorEmail: email,
            rating,
            title: title || undefined,
            body: body || undefined,
          }),
        }
      );

      if (res.ok) {
        onSubmitted();
      } else {
        const json = await res.json();
        setFormError(json.error || "Failed to submit review");
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-lg">
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--brand-text)" }}
        >
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(s)}
              className="p-0.5"
            >
              <Star
                className="h-6 w-6 transition-colors"
                style={{
                  color:
                    s <= (hoverRating || rating)
                      ? accentColor
                      : "var(--brand-border)",
                  fill:
                    s <= (hoverRating || rating)
                      ? accentColor
                      : "transparent",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg text-sm"
          style={{
            borderColor: "var(--brand-border)",
            backgroundColor: "var(--brand-surface)",
            color: "var(--brand-text)",
          }}
        />
        <input
          type="email"
          placeholder="Your email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg text-sm"
          style={{
            borderColor: "var(--brand-border)",
            backgroundColor: "var(--brand-surface)",
            color: "var(--brand-text)",
          }}
        />
      </div>

      <input
        type="text"
        placeholder="Review title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm"
        style={{
          borderColor: "var(--brand-border)",
          backgroundColor: "var(--brand-surface)",
          color: "var(--brand-text)",
        }}
      />

      <textarea
        placeholder="Your review (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
        style={{
          borderColor: "var(--brand-border)",
          backgroundColor: "var(--brand-surface)",
          color: "var(--brand-text)",
        }}
      />

      {formError && <p className="text-sm text-red-500">{formError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
        style={{
          backgroundColor: accentColor,
          color: "var(--brand-accent-text)",
          minHeight: "44px",
        }}
      >
        <Send className="h-4 w-4" />
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
