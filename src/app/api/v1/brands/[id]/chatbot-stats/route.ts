import { NextRequest } from "next/server";
import { eq, sql, and, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { chatMessages } from "@/lib/db/schema";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    // Total unique sessions
    const totalSessionsResult = db
      .select({ count: sql<number>`COUNT(DISTINCT ${chatMessages.sessionId})` })
      .from(chatMessages)
      .where(eq(chatMessages.brandId, id))
      .get();

    // Total messages
    const totalMessagesResult = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(chatMessages)
      .where(eq(chatMessages.brandId, id))
      .get();

    // Messages today
    const today = new Date().toISOString().split("T")[0];
    const messagesTodayResult = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.brandId, id),
          gte(chatMessages.createdAt, today)
        )
      )
      .get();

    const totalSessions = totalSessionsResult?.count ?? 0;
    const totalMessages = totalMessagesResult?.count ?? 0;
    const messagesToday = messagesTodayResult?.count ?? 0;
    const avgPerSession = totalSessions > 0
      ? Math.round((totalMessages / totalSessions) * 10) / 10
      : 0;

    return success({
      totalSessions,
      totalMessages,
      messagesToday,
      avgPerSession,
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("GET chatbot-stats error:", err);
    return error("Internal server error", 500);
  }
}
