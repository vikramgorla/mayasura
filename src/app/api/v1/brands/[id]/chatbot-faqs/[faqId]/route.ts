import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { chatbotFaqs } from "@/lib/db/schema";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { success, noContent, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string; faqId: string }>;
}

const updateSchema = z.object({
  question: z.string().min(1).max(500).optional(),
  answer: z.string().min(1).max(2000).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, faqId } = await params;
    await requireBrandOwner(id);

    const faq = db
      .select()
      .from(chatbotFaqs)
      .where(and(eq(chatbotFaqs.id, faqId), eq(chatbotFaqs.brandId, id)))
      .get();

    if (!faq) return error("FAQ not found", 404);

    const body: unknown = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return error(messages, 400);
    }

    const updates: Record<string, unknown> = {};
    if (parsed.data.question !== undefined) updates.question = parsed.data.question;
    if (parsed.data.answer !== undefined) updates.answer = parsed.data.answer;
    if (parsed.data.sortOrder !== undefined) updates.sortOrder = parsed.data.sortOrder;

    if (Object.keys(updates).length === 0) return error("No fields to update", 400);

    db.update(chatbotFaqs).set(updates).where(eq(chatbotFaqs.id, faqId)).run();

    const updated = db.select().from(chatbotFaqs).where(eq(chatbotFaqs.id, faqId)).get();
    return success(updated);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("PUT chatbot-faqs error:", err);
    return error("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id, faqId } = await params;
    await requireBrandOwner(id);

    const faq = db
      .select()
      .from(chatbotFaqs)
      .where(and(eq(chatbotFaqs.id, faqId), eq(chatbotFaqs.brandId, id)))
      .get();

    if (!faq) return error("FAQ not found", 404);

    db.delete(chatbotFaqs).where(eq(chatbotFaqs.id, faqId)).run();

    return noContent();
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("DELETE chatbot-faqs error:", err);
    return error("Internal server error", 500);
  }
}
