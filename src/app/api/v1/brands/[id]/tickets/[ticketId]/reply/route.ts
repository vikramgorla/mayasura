import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { tickets, ticketMessages } from "@/lib/db/schema";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { created, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; ticketId: string }>;
}

const replySchema = z.object({
  content: z.string().min(1, "Reply content is required").max(5000),
});

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const parsed = replySchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return error(messages, 400);
    }

    const message = {
      id: nanoid(),
      ticketId,
      role: "agent" as const,
      content: parsed.data.content,
    };

    db.insert(ticketMessages).values(message).run();

    // Update ticket status to in-progress if it was open
    if (ticket.status === "open") {
      db.update(tickets)
        .set({ status: "in-progress", updatedAt: new Date().toISOString() })
        .where(eq(tickets.id, ticketId))
        .run();
    }

    return created(message);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("POST ticket reply error:", err);
    return error("Internal server error", 500);
  }
}
