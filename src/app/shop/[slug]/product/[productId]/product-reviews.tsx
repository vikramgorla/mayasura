"use client";

import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import { ReviewForm } from "./review-form";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
}

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
  distribution: Record<number, number>;
}

interface ProductReviewsProps {
  slug: string;
  productId: string;
  accentColor: string;
}

export function ProductReviews({
  slug,
  productId,
  accentColor,
}: ProductReviewsProps) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/v1/public/brand/${slug}/products/${productId}/reviews`
      );
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch {
      // silent
    }
  }, [slug, productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div>
      <h2
        className="text-xl font-bold mb-6"
        style={{
          fontFamily: "var(--brand-font-heading)",
          color: "var(--brand-text)",
        }}
      >
        Customer Reviews
      </h2>

      {/* Rating Summary */}
      {data && data.totalCount > 0 && (
        <RatingSummary data={data} accentColor={accentColor} />
      )}

      {/* Review List */}
      {data?.reviews.map((review) => (
        <ReviewItem key={review.id} review={review} accentColor={accentColor} />
      ))}

      {/* Write Review */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 px-4 py-2 text-sm font-medium rounded-lg transition-all"
          style={{
            border: `1px solid ${accentColor}`,
            color: accentColor,
            minHeight: "44px",
          }}
        >
          Write a Review
        </button>
      )}

      {submitted && (
        <div
          className="mt-6 p-4 rounded-lg text-sm"
          style={{
            backgroundColor: `${accentColor}10`,
            color: accentColor,
          }}
        >
          Thank you for your review! It will appear after moderation.
        </div>
      )}

      {showForm && !submitted && (
        <ReviewForm
          slug={slug}
          productId={productId}
          accentColor={accentColor}
          onSubmitted={() => setSubmitted(true)}
        />
      )}

      {data && data.totalCount === 0 && !showForm && !submitted && (
        <p className="text-sm mt-4" style={{ color: "var(--brand-muted)" }}>
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </div>
  );
}

function RatingSummary({
  data,
  accentColor,
}: {
  data: ReviewsData;
  accentColor: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 mb-8">
      <div className="text-center">
        <p className="text-4xl font-bold" style={{ color: "var(--brand-text)" }}>
          {data.averageRating}
        </p>
        <div className="flex justify-center mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="h-4 w-4"
              style={{
                color: s <= Math.round(data.averageRating) ? accentColor : "var(--brand-border)",
                fill: s <= Math.round(data.averageRating) ? accentColor : "transparent",
              }}
            />
          ))}
        </div>
        <p className="text-sm mt-1" style={{ color: "var(--brand-muted)" }}>
          {data.totalCount} review{data.totalCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = data.distribution[star] || 0;
          const pct = data.totalCount > 0 ? (count / data.totalCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-right" style={{ color: "var(--brand-muted)" }}>
                {star}
              </span>
              <Star className="h-3 w-3" style={{ color: accentColor, fill: accentColor }} />
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--brand-border)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: accentColor }}
                />
              </div>
              <span className="w-8 text-right text-xs" style={{ color: "var(--brand-muted)" }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewItem({
  review,
  accentColor,
}: {
  review: Review;
  accentColor: string;
}) {
  return (
    <div className="border-b py-4" style={{ borderColor: "var(--brand-border)" }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="h-3.5 w-3.5"
              style={{
                color: s <= review.rating ? accentColor : "var(--brand-border)",
                fill: s <= review.rating ? accentColor : "transparent",
              }}
            />
          ))}
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--brand-text)" }}>
          {review.authorName}
        </span>
        <span className="text-xs" style={{ color: "var(--brand-muted)" }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      {review.title && (
        <p className="font-medium text-sm" style={{ color: "var(--brand-text)" }}>
          {review.title}
        </p>
      )}
      {review.body && (
        <p className="text-sm mt-1" style={{ color: "var(--brand-muted)" }}>
          {review.body}
        </p>
      )}
    </div>
  );
}
