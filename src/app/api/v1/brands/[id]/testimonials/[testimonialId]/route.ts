import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { testimonials } from "@/lib/db/schema";
import { success, error, noContent } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; testimonialId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, testimonialId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(testimonials)
      .where(
        and(
          eq(testimonials.id, testimonialId),
          eq(testimonials.brandId, id)
        )
      )
      .get();

    if (!existing) {
      return error("Testimonial not found", 404);
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.authorName !== undefined) updates.authorName = body.authorName;
    if (body.authorRole !== undefined) updates.authorRole = body.authorRole;
    if (body.authorCompany !== undefined) updates.authorCompany = body.authorCompany;
    if (body.quote !== undefined) updates.quote = body.quote;
    if (body.rating !== undefined) updates.rating = body.rating;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

    db.update(testimonials)
      .set(updates)
      .where(eq(testimonials.id, testimonialId))
      .run();

    const updated = db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, testimonialId))
      .get();

    return success(updated);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Update testimonial error:", err);
    return error("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id, testimonialId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(testimonials)
      .where(
        and(
          eq(testimonials.id, testimonialId),
          eq(testimonials.brandId, id)
        )
      )
      .get();

    if (!existing) {
      return error("Testimonial not found", 404);
    }

    db.delete(testimonials)
      .where(eq(testimonials.id, testimonialId))
      .run();

    return noContent();
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Delete testimonial error:", err);
    return error("Internal server error", 500);
  }
}
