import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import { error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { brand } = await requireBrandOwner(id);

    const list = db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.brandId, id))
      .orderBy(desc(newsletterSubscribers.subscribedAt))
      .all();

    const csvRows = ["email,name,status,subscribed_at"];
    for (const sub of list) {
      const name = (sub.name || "").replace(/"/g, '""');
      csvRows.push(
        `"${sub.email}","${name}","${sub.status}","${sub.subscribedAt}"`
      );
    }

    const csv = csvRows.join("\n");
    const filename = `${brand.slug}-subscribers-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Export subscribers error:", err);
    return error("Internal server error", 500);
  }
}
