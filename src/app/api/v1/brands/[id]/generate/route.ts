import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { isAiAvailable } from "@/lib/ai/client";
import { generateInitialContent } from "@/lib/ai/suggest";
import { db } from "@/lib/db/client";
import { brands, content, chatbotFaqs, products } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { brand } = await requireBrandOwner(id);

    if (!isAiAvailable()) {
      return success({ generated: false, reason: "AI not configured" });
    }

    // Fetch brand products
    const brandProducts = db
      .select()
      .from(products)
      .where(eq(products.brandId, id))
      .all();

    const generated = await generateInitialContent({
      name: brand.name,
      tagline: brand.tagline ?? undefined,
      industry: brand.industry ?? undefined,
      brandVoice: brand.brandVoice ?? undefined,
      products: brandProducts.map((p) => ({
        name: p.name,
        description: p.description ?? undefined,
      })),
    });

    // Store hero content
    db.insert(content)
      .values({
        id: nanoid(),
        brandId: id,
        type: "hero",
        title: generated.heroHeadline,
        body: generated.heroSubtext,
        status: "published",
      })
      .run();

    // Store about content
    db.insert(content)
      .values({
        id: nanoid(),
        brandId: id,
        type: "about",
        title: "About Us",
        body: generated.aboutCopy,
        status: "published",
      })
      .run();

    // Update chatbot greeting
    db.update(brands)
      .set({ chatbotGreeting: generated.chatbotGreeting })
      .where(eq(brands.id, id))
      .run();

    // Store FAQ entries
    for (let i = 0; i < generated.faqEntries.length; i++) {
      const faq = generated.faqEntries[i];
      if (faq) {
        db.insert(chatbotFaqs)
          .values({
            id: nanoid(),
            brandId: id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: i,
          })
          .run();
      }
    }

    return success({ generated: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("Generate content error:", err);
    // Graceful — if AI fails, just report it
    return success({ generated: false, reason: "Generation failed" });
  }
}
