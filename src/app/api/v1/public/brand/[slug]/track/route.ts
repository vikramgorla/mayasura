import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db/client";
import { brands, pageViews } from "@/lib/db/schema";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const brand = db
      .select({ id: brands.id, status: brands.status })
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!brand || brand.status !== "launched") {
      return new Response(null, { status: 204 });
    }

    let body: { page?: string; referrer?: string; userAgent?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Accept empty body
    }

    const page = typeof body.page === "string" ? body.page.slice(0, 500) : "/";
    const referrer =
      typeof body.referrer === "string" ? body.referrer.slice(0, 1000) : null;
    const userAgent =
      typeof body.userAgent === "string"
        ? body.userAgent.slice(0, 500)
        : request.headers.get("user-agent")?.slice(0, 500) || null;

    // Fire and forget — don't block response
    db.insert(pageViews)
      .values({
        id: nanoid(),
        brandId: brand.id,
        page,
        referrer,
        userAgent,
      })
      .run();

    return new Response(null, { status: 204 });
  } catch {
    // Fire and forget — always return 204
    return new Response(null, { status: 204 });
  }
}
