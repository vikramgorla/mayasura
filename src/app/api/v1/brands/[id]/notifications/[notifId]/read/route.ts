import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { notifications } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; notifId: string }>;
}

export async function PUT(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id, notifId } = await params;
    await requireBrandOwner(id);

    const notif = db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.id, notifId),
          eq(notifications.brandId, id)
        )
      )
      .get();

    if (!notif) {
      return error("Notification not found", 404);
    }

    db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notifId))
      .run();

    return success({ id: notifId, isRead: true });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Mark notification read error:", err);
    return error("Internal server error", 500);
  }
}
