import { NextRequest } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db/client";
import { brands, products, reviews } from "@/lib/db/schema";
import { createReviewSchema } from "@/lib/validation/review";
import { success, error, created } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ slug: string; productId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug, productId } = await params;

    const brand = db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!brand) return error("Brand not found", 404);

    // Verify product belongs to brand
    const product = db
      .select()
      .from(products)
      .where(
        and(eq(products.id, productId), eq(products.brandId, brand.id))
      )
      .get();

    if (!product) return error("Product not found", 404);

    const approvedReviews = db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.status, "approved")
        )
      )
      .orderBy(desc(reviews.createdAt))
      .all();

    // Calculate rating distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    for (const review of approvedReviews) {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
      totalRating += review.rating;
    }

    const averageRating =
      approvedReviews.length > 0
        ? totalRating / approvedReviews.length
        : 0;

    return success({
      reviews: approvedReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalCount: approvedReviews.length,
      distribution,
    });
  } catch (err) {
    console.error("Get reviews error:", err);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug, productId } = await params;

    const brand = db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!brand || brand.status !== "launched") {
      return error("Brand not found", 404);
    }

    const product = db
      .select()
      .from(products)
      .where(
        and(eq(products.id, productId), eq(products.brandId, brand.id))
      )
      .get();

    if (!product) return error("Product not found", 404);

    const body: unknown = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const review = {
      id: nanoid(),
      brandId: brand.id,
      productId,
      ...parsed.data,
      verifiedPurchase: false,
      helpfulCount: 0,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    db.insert(reviews).values(review).run();

    return created({ id: review.id, status: "pending" });
  } catch (err) {
    console.error("Submit review error:", err);
    return error("Internal server error", 500);
  }
}
