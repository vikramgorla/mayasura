import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { updateProductSchema } from "@/lib/validation/product";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
import { success, error, noContent } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; productId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, productId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), eq(products.brandId, id)))
      .get();

    if (!existing) return error("Product not found", 404);

    const body: unknown = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    db.update(products)
      .set(parsed.data)
      .where(eq(products.id, productId))
      .run();

    const updated = db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .get();

    return success(updated);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Update product error:", err);
    return error("Internal server error", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id, productId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(products)
      .where(and(eq(products.id, productId), eq(products.brandId, id)))
      .get();

    if (!existing) return error("Product not found", 404);

    db.delete(products).where(eq(products.id, productId)).run();

    return noContent();
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Delete product error:", err);
    return error("Internal server error", 500);
  }
}
