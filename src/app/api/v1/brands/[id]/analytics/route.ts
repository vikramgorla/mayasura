import { NextRequest } from "next/server";
import { eq, and, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pageViews } from "@/lib/db/schema";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function detectDevice(ua: string | null): "desktop" | "mobile" | "tablet" {
  if (!ua) return "desktop";
  const lower = ua.toLowerCase();
  if (/ipad|tablet|kindle|playbook/.test(lower)) return "tablet";
  if (/mobile|iphone|android|windows phone|blackberry/.test(lower)) return "mobile";
  return "desktop";
}

function dateNDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0]!;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(parseInt(searchParams.get("days") || "30", 10) || 30, 1), 365);

    const currentStart = dateNDaysAgo(days);
    const prevStart = dateNDaysAgo(days * 2);

    // Current period total
    const totalResult = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(pageViews)
      .where(and(eq(pageViews.brandId, id), gte(pageViews.createdAt, currentStart)))
      .get();

    // Previous period total
    const prevTotalResult = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(pageViews)
      .where(and(
        eq(pageViews.brandId, id),
        gte(pageViews.createdAt, prevStart),
        lt(pageViews.createdAt, currentStart)
      ))
      .get();

    // Unique visitors (current)
    const uniqueResult = db
      .select({ count: sql<number>`COUNT(DISTINCT ${pageViews.userAgent})` })
      .from(pageViews)
      .where(and(eq(pageViews.brandId, id), gte(pageViews.createdAt, currentStart)))
      .get();

    // Unique visitors (previous)
    const prevUniqueResult = db
      .select({ count: sql<number>`COUNT(DISTINCT ${pageViews.userAgent})` })
      .from(pageViews)
      .where(and(
        eq(pageViews.brandId, id),
        gte(pageViews.createdAt, prevStart),
        lt(pageViews.createdAt, currentStart)
      ))
      .get();

    // Views by day
    const byDay = db
      .select({
        date: sql<string>`DATE(${pageViews.createdAt})`.as("date"),
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(pageViews)
      .where(and(eq(pageViews.brandId, id), gte(pageViews.createdAt, currentStart)))
      .groupBy(sql`DATE(${pageViews.createdAt})`)
      .orderBy(sql`DATE(${pageViews.createdAt})`)
      .all();

    // Top pages
    const byPage = db
      .select({
        page: pageViews.page,
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(pageViews)
      .where(and(eq(pageViews.brandId, id), gte(pageViews.createdAt, currentStart)))
      .groupBy(pageViews.page)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10)
      .all();

    // Referrers
    const byReferrer = db
      .select({
        referrer: pageViews.referrer,
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(pageViews)
      .where(and(
        eq(pageViews.brandId, id),
        gte(pageViews.createdAt, currentStart),
        sql`${pageViews.referrer} IS NOT NULL AND ${pageViews.referrer} != ''`
      ))
      .groupBy(pageViews.referrer)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10)
      .all();

    // Device breakdown - fetch user agents and classify
    const allViews = db
      .select({ userAgent: pageViews.userAgent })
      .from(pageViews)
      .where(and(eq(pageViews.brandId, id), gte(pageViews.createdAt, currentStart)))
      .all();

    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    for (const view of allViews) {
      const device = detectDevice(view.userAgent);
      devices[device]++;
    }

    return success({
      total: totalResult?.count ?? 0,
      prevTotal: prevTotalResult?.count ?? 0,
      uniqueVisitors: uniqueResult?.count ?? 0,
      prevUniqueVisitors: prevUniqueResult?.count ?? 0,
      byDay,
      byPage,
      devices,
      byReferrer,
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("GET analytics error:", err);
    return error("Internal server error", 500);
  }
}
