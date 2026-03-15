import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { requireAuth, AuthError } from "@/lib/auth/guards";
import { blogWriterSchema } from "@/lib/validation/blog";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";
import { getAiClient, isAiAvailable } from "@/lib/ai/client";
import { success, error } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();

    if (!isAiAvailable()) {
      return error("AI features are not configured", 503);
    }

    const body: unknown = await request.json();
    const parsed = blogWriterSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { brandId, topic, step, content, outline } = parsed.data;

    // Verify brand ownership
    const brand = db
      .select()
      .from(brands)
      .where(eq(brands.id, brandId))
      .get();

    if (!brand || brand.userId !== auth.user.id) {
      return error("Brand not found or not authorized", 403);
    }

    const client = getAiClient();
    const brandContext = `Brand: ${brand.name}. Industry: ${brand.industry || "general"}. Voice: ${brand.brandVoice || "professional and engaging"}.`;

    let prompt: string;
    let result: Record<string, string>;

    switch (step) {
      case "outline":
        prompt = `${brandContext}\n\nCreate a detailed blog post outline for the topic: "${topic}"\n\nReturn a structured outline with:\n- A compelling title\n- 4-6 main sections with brief descriptions\n- Key points for each section\n\nFormat as markdown with ## for sections and - for points.`;
        break;

      case "article":
        prompt = `${brandContext}\n\nWrite a complete, engaging blog article based on this outline:\n\n${outline || topic}\n\nRequirements:\n- Write 800-1500 words\n- Use markdown formatting\n- Include an engaging introduction and conclusion\n- Be informative and actionable\n- Match the brand voice\n- Use ## for main headings, ### for subheadings`;
        break;

      case "improve":
        prompt = `${brandContext}\n\nImprove and polish this blog article. Fix grammar, improve flow, make it more engaging, and ensure it matches the brand voice:\n\n${content}\n\nReturn the improved article in markdown format.`;
        break;

      case "seo":
        prompt = `${brandContext}\n\nGenerate SEO metadata for this blog post:\n\n${content?.slice(0, 2000)}\n\nReturn a JSON object with:\n- "seoTitle": SEO-optimized title (max 60 characters)\n- "seoDescription": Meta description (max 160 characters)\n- "tags": Array of 3-5 relevant tags\n- "excerpt": A compelling 2-sentence excerpt\n\nReturn ONLY the JSON object, no additional text.`;
        break;

      default:
        return error("Invalid step", 400);
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const firstBlock = response.content[0];
    const text =
      firstBlock && firstBlock.type === "text" ? firstBlock.text : "";

    if (step === "seo") {
      try {
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };
      } catch {
        result = { raw: text };
      }
    } else {
      result = { content: text };
    }

    return success({ step, result });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("AI blog writer error:", err);
    return error("Failed to generate content", 500);
  }
}
