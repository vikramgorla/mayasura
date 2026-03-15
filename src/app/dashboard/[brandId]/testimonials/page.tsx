"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, Star, ArrowUp, ArrowDown, Award, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TestimonialForm } from "./testimonial-form";

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  quote: string;
  rating: number | null;
  featured: boolean;
  sortOrder: number;
}

export default function TestimonialsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/brands/${brandId}/testimonials`);
      if (res.ok) {
        const json = await res.json();
        setTestimonials(json.data || []);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [brandId]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await fetch(`/api/v1/brands/${brandId}/testimonials/${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch { /* silent */ }
  }

  async function toggleFeatured(t: Testimonial) {
    try {
      await fetch(`/api/v1/brands/${brandId}/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !t.featured }),
      });
      fetchTestimonials();
    } catch { /* silent */ }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const idx = testimonials.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= testimonials.length) return;

    const current = testimonials[idx]!;
    const swap = testimonials[swapIdx]!;

    await Promise.all([
      fetch(`/api/v1/brands/${brandId}/testimonials/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: swap.sortOrder }),
      }),
      fetch(`/api/v1/brands/${brandId}/testimonials/${swap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    fetchTestimonials();
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between"><Skeleton className="h-8 w-32" /><Skeleton className="h-9 w-40" /></div>
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Testimonials</h1>
          <p className="text-sm text-[var(--text-secondary)]">{testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="brand" size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Testimonial
        </Button>
      </div>

      {showForm && (
        <TestimonialForm
          brandId={brandId}
          testimonial={editing}
          onSaved={() => { setShowForm(false); setEditing(null); fetchTestimonials(); }}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {testimonials.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <MessageSquareQuote className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">No testimonials yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Add testimonials from your customers to build trust.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {testimonials.map((t, idx) => (
            <div key={t.id} className="flex items-start gap-3 p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]">
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => handleReorder(t.id, "up")} disabled={idx === 0} className="p-0.5 disabled:opacity-20">
                  <ArrowUp className="h-3 w-3 text-[var(--text-secondary)]" />
                </button>
                <button onClick={() => handleReorder(t.id, "down")} disabled={idx === testimonials.length - 1} className="p-0.5 disabled:opacity-20">
                  <ArrowDown className="h-3 w-3 text-[var(--text-secondary)]" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{t.authorName}</span>
                  {t.authorRole && <span className="text-xs text-[var(--text-secondary)]">{t.authorRole}</span>}
                  {t.authorCompany && <span className="text-xs text-[var(--text-tertiary)]">@ {t.authorCompany}</span>}
                  {t.featured && <Badge variant="default"><Award className="h-3 w-3 mr-0.5" />Featured</Badge>}
                </div>
                {t.rating && (
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating! ? "text-amber-400 fill-amber-400" : "text-[var(--text-tertiary)]"}`} />
                    ))}
                  </div>
                )}
                <p className="text-sm text-[var(--text-secondary)] italic line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
              </div>

              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => toggleFeatured(t)} title={t.featured ? "Unfeature" : "Feature"}>
                  <Award className={`h-3.5 w-3.5 ${t.featured ? "text-amber-500" : "text-[var(--text-tertiary)]"}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setShowForm(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
