import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { updateReviewStatusSchema } from "@/lib/validation/review";
import { db } from "@/lib/db/client";
import { reviews } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; reviewId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, reviewId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.brandId, id)))
      .get();

    if (!existing) return error("Review not found", 404);

    const body: unknown = await request.json();
    const parsed = updateReviewStatusSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    db.update(reviews)
      .set({ status: parsed.data.status })
      .where(eq(reviews.id, reviewId))
      .run();

    const updated = db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .get();

    return success(updated);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Update review error:", err);
    return error("Internal server error", 500);
  }
}
