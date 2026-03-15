import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { updateBlogPostSchema } from "@/lib/validation/blog";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { success, error, noContent } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; postId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, postId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.id, postId), eq(blogPosts.brandId, id)))
      .get();

    if (!existing) return error("Blog post not found", 404);

    const body: unknown = await request.json();
    const parsed = updateBlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { tags, ...data } = parsed.data;
    const now = new Date().toISOString();

    // If publishing for the first time, set publishedAt
    const publishedAt =
      data.status === "published" && !existing.publishedAt
        ? now
        : data.status === "draft"
          ? null
          : existing.publishedAt;

    db.update(blogPosts)
      .set({
        ...data,
        ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
        publishedAt,
        updatedAt: now,
      })
      .where(eq(blogPosts.id, postId))
      .run();

    const updated = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, postId))
      .get();

    return success({
      ...updated,
      tags: updated?.tags ? JSON.parse(updated.tags) : [],
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Update blog post error:", err);
    return error("Internal server error", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id, postId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.id, postId), eq(blogPosts.brandId, id)))
      .get();

    if (!existing) return error("Blog post not found", 404);

    db.delete(blogPosts).where(eq(blogPosts.id, postId)).run();

    return noContent();
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Delete blog post error:", err);
    return error("Internal server error", 500);
  }
}
