import { NextRequest } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth/guards";
import { isAiAvailable } from "@/lib/ai/client";
import {
  suggestBrandNames,
  suggestTaglines,
  suggestColorPalette,
  suggestTemplates,
  analyzeVoice,
  enhanceProductDescription,
} from "@/lib/ai/suggest";
import { success, error } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    if (!isAiAvailable()) {
      return error(
        "AI features require ANTHROPIC_API_KEY. Configure it in your environment.",
        503
      );
    }

    const body = (await request.json()) as {
      type: string;
      industry?: string;
      keywords?: string[];
      brandName?: string;
      mood?: string;
      brandVoice?: string;
      description?: string;
      productName?: string;
      currentDescription?: string;
    };

    switch (body.type) {
      case "brand-names": {
        if (!body.industry) {
          return error("Industry is required for name suggestions", 400);
        }
        const suggestions = await suggestBrandNames(
          body.industry,
          body.keywords
        );
        return success({ suggestions });
      }

      case "taglines": {
        if (!body.brandName || !body.industry) {
          return error(
            "Brand name and industry are required for tagline suggestions",
            400
          );
        }
        const suggestions = await suggestTaglines(
          body.brandName,
          body.industry
        );
        return success({ suggestions });
      }

      case "colors": {
        if (!body.industry) {
          return error("Industry is required for color suggestions", 400);
        }
        const palette = await suggestColorPalette(body.industry, body.mood);
        return success({ palette });
      }

      case "website-template": {
        if (!body.industry) {
          return error(
            "Industry is required for template recommendations",
            400
          );
        }
        const recommendations = await suggestTemplates(
          body.industry,
          body.brandVoice
        );
        return success({ recommendations });
      }

      case "analyze-voice": {
        if (!body.description) {
          return error("Description is required for voice analysis", 400);
        }
        const analysis = await analyzeVoice(body.description);
        return success({ analysis });
      }

      case "enhance-product": {
        if (!body.productName || !body.currentDescription) {
          return error(
            "Product name and current description are required",
            400
          );
        }
        const description = await enhanceProductDescription(
          body.productName,
          body.currentDescription,
          body.brandVoice
        );
        return success({ description });
      }

      default:
        return error(
          `Unknown suggestion type: ${body.type}. Valid types: brand-names, taglines, colors, website-template, analyze-voice, enhance-product`,
          400
        );
    }
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("AI suggest error:", err);
    return error("AI suggestion failed. Please try again.", 500);
  }
}
