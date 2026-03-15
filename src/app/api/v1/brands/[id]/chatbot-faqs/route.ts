import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { chatbotFaqs } from "@/lib/db/schema";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { success, created, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const faqSchema = z.object({
  question: z.string().min(1, "Question is required").max(500),
  answer: z.string().min(1, "Answer is required").max(2000),
});

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const faqs = db
      .select()
      .from(chatbotFaqs)
      .where(eq(chatbotFaqs.brandId, id))
      .orderBy(chatbotFaqs.sortOrder)
      .all();

    return success(faqs);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("GET chatbot-faqs error:", err);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const body: unknown = await request.json();
    const parsed = faqSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return error(messages, 400);
    }

    // Get next sort order
    const existing = db
      .select({ sortOrder: chatbotFaqs.sortOrder })
      .from(chatbotFaqs)
      .where(eq(chatbotFaqs.brandId, id))
      .orderBy(chatbotFaqs.sortOrder)
      .all();

    const nextOrder = existing.length > 0
      ? Math.max(...existing.map((f) => f.sortOrder)) + 1
      : 0;

    const faq = {
      id: nanoid(),
      brandId: id,
      question: parsed.data.question,
      answer: parsed.data.answer,
      sortOrder: nextOrder,
    };

    db.insert(chatbotFaqs).values(faq).run();

    return created(faq);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("POST chatbot-faqs error:", err);
    return error("Internal server error", 500);
  }
}
