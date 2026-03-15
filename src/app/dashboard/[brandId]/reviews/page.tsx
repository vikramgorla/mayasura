"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Star, Check, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  id: string;
  productId: string | null;
  productName: string | null;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: string;
  createdAt: string;
}

const STATUS_FILTERS = ["all", "pending", "approved", "rejected"] as const;

export default function ReviewsPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");

  const fetchReviews = useCallback(async () => {
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(
        `/api/v1/brands/${brandId}/reviews${params}`
      );
      if (res.ok) {
        const json = await res.json();
        setReviews(json.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [brandId, filter]);

  useEffect(() => {
    setLoading(true);
    fetchReviews();
  }, [fetchReviews]);

  async function updateStatus(reviewId: string, status: string) {
    try {
      const res = await fetch(
        `/api/v1/brands/${brandId}/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (res.ok) fetchReviews();
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          Reviews
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filter === s
                ? "bg-violet-600 text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--border-primary)] rounded-lg">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-[var(--text-tertiary)]" />
          <p className="font-medium text-[var(--text-primary)]">
            No reviews {filter !== "all" ? `with status "${filter}"` : "yet"}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Reviews from customers will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-surface)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Product name */}
                  {review.productName && (
                    <p className="text-xs text-[var(--text-secondary)] mb-1">
                      Product: {review.productName}
                    </p>
                  )}

                  {/* Stars + Author */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="h-3.5 w-3.5"
                          style={{
                            color:
                              s <= review.rating
                                ? "#EAB308"
                                : "var(--border-primary)",
                            fill:
                              s <= review.rating
                                ? "#EAB308"
                                : "transparent",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {review.authorName}
                    </span>
                    <Badge
                      variant={
                        review.status === "approved"
                          ? "default"
                          : review.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {review.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {review.title}
                    </p>
                  )}

                  {/* Body */}
                  {review.body && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-3">
                      {review.body}
                    </p>
                  )}

                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    {new Date(review.createdAt).toLocaleDateString()} •{" "}
                    {review.authorEmail}
                  </p>
                </div>

                {/* Actions */}
                {review.status === "pending" && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateStatus(review.id, "approved")
                      }
                      title="Approve"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateStatus(review.id, "rejected")
                      }
                      title="Reject"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
