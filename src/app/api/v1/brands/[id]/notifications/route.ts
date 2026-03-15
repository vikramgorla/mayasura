import { NextRequest } from "next/server";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { notifications } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);

    const list = db
      .select()
      .from(notifications)
      .where(eq(notifications.brandId, id))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .all();

    const unreadCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.brandId, id),
          eq(notifications.isRead, false)
        )
      )
      .get()?.count ?? 0;

    return success({ notifications: list, unreadCount });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List notifications error:", err);
    return error("Internal server error", 500);
  }
}
