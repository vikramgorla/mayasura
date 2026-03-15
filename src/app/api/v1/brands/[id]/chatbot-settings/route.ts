import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const settingsSchema = z.object({
  chatbotGreeting: z.string().max(500).optional(),
  chatbotColor: z.string().max(20).optional(),
  chatbotTone: z.string().max(50).optional(),
});

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { brand } = await requireBrandOwner(id);

    return success({
      chatbotGreeting: brand.chatbotGreeting,
      chatbotColor: brand.chatbotColor,
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("GET chatbot-settings error:", err);
    return error("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const body: unknown = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return error(messages, 400);
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (parsed.data.chatbotGreeting !== undefined) {
      updates.chatbotGreeting = parsed.data.chatbotGreeting;
    }
    if (parsed.data.chatbotColor !== undefined) {
      updates.chatbotColor = parsed.data.chatbotColor;
    }

    db.update(brands).set(updates).where(eq(brands.id, id)).run();

    return success({ updated: true });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("PUT chatbot-settings error:", err);
    return error("Internal server error", 500);
  }
}
