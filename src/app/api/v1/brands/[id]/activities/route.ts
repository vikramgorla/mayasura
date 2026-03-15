import { NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { activities } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const url = new URL(request.url);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "10", 10),
      50
    );

    const list = db
      .select()
      .from(activities)
      .where(eq(activities.brandId, id))
      .orderBy(desc(activities.createdAt))
      .limit(limit)
      .all();

    return success(list);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List activities error:", err);
    return error("Internal server error", 500);
  }
}
