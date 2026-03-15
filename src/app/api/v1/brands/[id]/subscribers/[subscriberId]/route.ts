import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; subscriberId: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id, subscriberId } = await params;
    await requireBrandOwner(id);

    const sub = db
      .select()
      .from(newsletterSubscribers)
      .where(
        and(
          eq(newsletterSubscribers.id, subscriberId),
          eq(newsletterSubscribers.brandId, id)
        )
      )
      .get();

    if (!sub) {
      return error("Subscriber not found", 404);
    }

    // Soft delete — mark as unsubscribed
    db.update(newsletterSubscribers)
      .set({ status: "unsubscribed" })
      .where(eq(newsletterSubscribers.id, subscriberId))
      .run();

    return success({ id: subscriberId, status: "unsubscribed" });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Delete subscriber error:", err);
    return error("Internal server error", 500);
  }
}
