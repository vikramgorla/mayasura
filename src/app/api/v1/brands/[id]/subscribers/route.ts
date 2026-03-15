import { NextRequest } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
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

    const conditions = [eq(newsletterSubscribers.brandId, id)];
    if (statusFilter && ["active", "unsubscribed"].includes(statusFilter)) {
      conditions.push(eq(newsletterSubscribers.status, statusFilter));
    }

    const list = db
      .select()
      .from(newsletterSubscribers)
      .where(and(...conditions))
      .orderBy(desc(newsletterSubscribers.subscribedAt))
      .all();

    return success(list);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List subscribers error:", err);
    return error("Internal server error", 500);
  }
}
