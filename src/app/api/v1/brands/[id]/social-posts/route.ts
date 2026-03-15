import { NextRequest } from "next/server";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { getAiClient, isAiAvailable } from "@/lib/ai/client";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const PLATFORM_CONFIGS: Record<string, { maxChars: number; tone: string }> = {
  twitter: {
    maxChars: 280,
    tone: "concise and engaging with a hook. Use 1-2 relevant hashtags max.",
  },
  instagram: {
    maxChars: 2200,
    tone: "visual and storytelling-oriented. Include 5-10 relevant hashtags at the end.",
  },
  linkedin: {
    maxChars: 3000,
    tone: "professional and thought-leadership focused. Open with a hook line. No hashtags inline, add 3-5 at the end.",
  },
};

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { brand } = await requireBrandOwner(id);

    if (!isAiAvailable()) {
      return error("AI features require ANTHROPIC_API_KEY configuration", 503);
    }

    const body = await request.json();
    const platforms: string[] = body.platforms || ["twitter", "instagram", "linkedin"];
    const validPlatforms = platforms.filter((p) => p in PLATFORM_CONFIGS);

    if (validPlatforms.length === 0) {
      return error("No valid platforms specified. Use: twitter, instagram, linkedin", 400);
    }

    const brandContext = [
      `Brand name: ${brand.name}`,
      brand.tagline ? `Tagline: ${brand.tagline}` : null,
      brand.description ? `Description: ${brand.description}` : null,
      brand.industry ? `Industry: ${brand.industry}` : null,
      brand.brandVoice ? `Brand voice: ${brand.brandVoice}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const platformInstructions = validPlatforms
      .map((p) => {
        const config = PLATFORM_CONFIGS[p]!;
        return `Platform: ${p}\nMax characters: ${config.maxChars}\nTone: ${config.tone}`;
      })
      .join("\n\n");

    const ai = getAiClient();
    const response = await ai.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Generate social media posts for this brand. Return ONLY valid JSON.

${brandContext}

Generate one post per platform:
${platformInstructions}

Return JSON format:
{"posts":[{"platform":"twitter","content":"...","hashtags":["tag1","tag2"]},{"platform":"instagram","content":"...","hashtags":["tag1"]},{"platform":"linkedin","content":"...","hashtags":["tag1"]}]}

Only include the platforms requested. Content should be ready to post — no placeholders.`,
        },
      ],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return error("Failed to generate posts. Please try again.", 500);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return success(parsed);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Social posts generation error:", err);
    return error("Failed to generate social posts", 500);
  }
}
