import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { tickets, ticketMessages } from "@/lib/db/schema";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; ticketId: string }>;
}

const updateSchema = z.object({
  status: z.enum(["open", "in-progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id, ticketId } = await params;
    await requireBrandOwner(id);

    const ticket = db
      .select()
      .from(tickets)
      .where(and(eq(tickets.id, ticketId), eq(tickets.brandId, id)))
      .get();

    if (!ticket) return error("Ticket not found", 404);

    const messages = db
      .select()
      .from(ticketMessages)
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(ticketMessages.createdAt)
      .all();

    return success({ ...ticket, messages });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("GET ticket error:", err);
    return error("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, ticketId } = await params;
    await requireBrandOwner(id);

    const ticket = db
      .select()
      .from(tickets)
      .where(and(eq(tickets.id, ticketId), eq(tickets.brandId, id)))
      .get();

    if (!ticket) return error("Ticket not found", 404);

    const body: unknown = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return error(messages, 400);
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (parsed.data.status) updates.status = parsed.data.status;
    if (parsed.data.priority) updates.priority = parsed.data.priority;

    db.update(tickets).set(updates).where(eq(tickets.id, ticketId)).run();

    const updated = db.select().from(tickets).where(eq(tickets.id, ticketId)).get();
    return success(updated);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("PUT ticket error:", err);
    return error("Internal server error", 500);
  }
}
