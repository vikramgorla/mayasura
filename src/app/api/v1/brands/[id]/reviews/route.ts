import { NextRequest } from "next/server";
import { eq, desc, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { reviews, products } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");

    const conditions = [eq(reviews.brandId, id)];
    if (
      statusFilter &&
      ["pending", "approved", "rejected"].includes(statusFilter)
    ) {
      conditions.push(eq(reviews.status, statusFilter));
    }

    const list = db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        productName: products.name,
        authorName: reviews.authorName,
        authorEmail: reviews.authorEmail,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        status: reviews.status,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .where(and(...conditions))
      .orderBy(desc(reviews.createdAt))
      .all();

    return success(list);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List reviews error:", err);
    return error("Internal server error", 500);
  }
}
