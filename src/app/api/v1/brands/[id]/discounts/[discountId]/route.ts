import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { updateDiscountSchema } from "@/lib/validation/discount";
import { db } from "@/lib/db/client";
import { discountCodes } from "@/lib/db/schema";
import { success, error, noContent } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; discountId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, discountId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(discountCodes)
      .where(
        and(eq(discountCodes.id, discountId), eq(discountCodes.brandId, id))
      )
      .get();

    if (!existing) return error("Discount not found", 404);

    const body: unknown = await request.json();
    const parsed = updateDiscountSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    db.update(discountCodes)
      .set(parsed.data)
      .where(eq(discountCodes.id, discountId))
      .run();

    const updated = db
      .select()
      .from(discountCodes)
      .where(eq(discountCodes.id, discountId))
      .get();

    return success(updated);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Update discount error:", err);
    return error("Internal server error", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id, discountId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(discountCodes)
      .where(
        and(eq(discountCodes.id, discountId), eq(discountCodes.brandId, id))
      )
      .get();

    if (!existing) return error("Discount not found", 404);

    db.delete(discountCodes).where(eq(discountCodes.id, discountId)).run();

    return noContent();
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Delete discount error:", err);
    return error("Internal server error", 500);
  }
}
