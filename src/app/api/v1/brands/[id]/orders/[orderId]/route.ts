import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { updateOrderStatusSchema } from "@/lib/validation/order";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; orderId: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, orderId } = await params;
    await requireBrandOwner(id);

    const existing = db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.brandId, id)))
      .get();

    if (!existing) return error("Order not found", 404);

    const body: unknown = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    db.update(orders)
      .set({
        status: parsed.data.status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, orderId))
      .run();

    const updated = db.select().from(orders).where(eq(orders.id, orderId)).get();

    return success({
      ...updated,
      items: updated?.items ? JSON.parse(updated.items) : [],
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Update order error:", err);
    return error("Internal server error", 500);
  }
}
