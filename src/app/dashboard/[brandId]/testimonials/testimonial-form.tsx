"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  quote: string;
  rating: number | null;
  featured: boolean;
}

interface Props {
  brandId: string;
  testimonial: Testimonial | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function TestimonialForm({ brandId, testimonial, onSaved, onCancel }: Props) {
  const [authorName, setAuthorName] = useState(testimonial?.authorName || "");
  const [authorRole, setAuthorRole] = useState(testimonial?.authorRole || "");
  const [authorCompany, setAuthorCompany] = useState(testimonial?.authorCompany || "");
  const [quote, setQuote] = useState(testimonial?.quote || "");
  const [rating, setRating] = useState(testimonial?.rating || 5);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !quote.trim()) return;

    setSaving(true);
    try {
      const url = testimonial
        ? `/api/v1/brands/${brandId}/testimonials/${testimonial.id}`
        : `/api/v1/brands/${brandId}/testimonials`;

      const res = await fetch(url, {
        method: testimonial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName.trim(),
          authorRole: authorRole.trim() || null,
          authorCompany: authorCompany.trim() || null,
          quote: quote.trim(),
          rating,
        }),
      });

      if (res.ok) onSaved();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {testimonial ? "Edit Testimonial" : "Add Testimonial"}
        </h3>
        <button onClick={onCancel} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              Name *
            </label>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              Role
            </label>
            <Input
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="CEO"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              Company
            </label>
            <Input
              value={authorCompany}
              onChange={(e) => setAuthorCompany(e.target.value)}
              placeholder="Acme Inc."
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            Quote *
          </label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="What did they say about your brand?"
            required
            rows={3}
            className="w-full text-sm bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg p-3 text-[var(--text-primary)] resize-y focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <Star
                  className={`h-5 w-5 transition-colors ${
                    star <= rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-[var(--text-tertiary)]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" variant="brand" size="sm" disabled={saving}>
            {saving ? "Saving..." : testimonial ? "Update" : "Add"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
