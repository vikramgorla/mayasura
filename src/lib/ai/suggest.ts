import { getAiClient } from "./client";
import {
  WEBSITE_TEMPLATES,
  type WebsiteTemplate,
} from "@/lib/templates/website-templates";

export interface TemplateRecommendation {
  templateId: string;
  name: string;
  reason: string;
  score: number;
}

export interface VoiceAnalysis {
  tone: string;
  personality: string;
  sampleGreeting: string;
}

async function askClaude(prompt: string): Promise<string> {
  const client = getAiClient();
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type === "text") return block.text;
  return "";
}

export async function suggestBrandNames(
  industry: string,
  keywords?: string[]
): Promise<string[]> {
  const keywordClause = keywords?.length
    ? `Keywords to consider: ${keywords.join(", ")}.`
    : "";

  const raw = await askClaude(
    `You are a brand naming expert. Suggest 5 creative, memorable brand names for a ${industry} business. ${keywordClause}

Rules:
- Names should be 1-3 words
- Easy to spell and pronounce
- Domain-friendly (no special characters)
- Mix of invented words, compound words, and evocative names

Return ONLY a JSON array of 5 strings. No explanation. Example: ["Name1","Name2","Name3","Name4","Name5"]`
  );

  try {
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]) as string[];
  } catch {
    // fallback
  }
  return [];
}

export async function suggestTaglines(
  brandName: string,
  industry: string
): Promise<string[]> {
  const raw = await askClaude(
    `You are a branding copywriter. Suggest 5 short, punchy taglines for "${brandName}" in the ${industry} industry.

Rules:
- Max 8 words each
- Memorable and distinct
- Mix of functional and emotional
- No clichés like "Your one-stop shop"

Return ONLY a JSON array of 5 strings. No explanation.`
  );

  try {
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]) as string[];
  } catch {
    // fallback
  }
  return [];
}

export async function suggestColorPalette(
  industry: string,
  mood?: string
): Promise<{ primary: string; secondary: string; accent: string }> {
  const moodClause = mood ? `The brand mood is: ${mood}.` : "";

  const raw = await askClaude(
    `You are a brand color specialist. Suggest a color palette for a ${industry} business. ${moodClause}

Return ONLY a JSON object with three hex color values:
{"primary":"#xxxxxx","secondary":"#xxxxxx","accent":"#xxxxxx"}

The primary should be the main brand color, secondary a complementary background/text color, and accent a vibrant highlight color. Ensure contrast accessibility.`
  );

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as {
        primary: string;
        secondary: string;
        accent: string;
      };
    }
  } catch {
    // fallback
  }
  return { primary: "#18181B", secondary: "#FAFAFA", accent: "#5B21B6" };
}

export async function suggestTemplates(
  industry: string,
  brandVoice?: string
): Promise<TemplateRecommendation[]> {
  const templateList = WEBSITE_TEMPLATES.map(
    (t: WebsiteTemplate) =>
      `- ${t.id}: ${t.name} — ${t.description} Best for: ${t.bestFor.join(", ")}`
  ).join("\n");

  const voiceClause = brandVoice
    ? `The brand voice is: ${brandVoice}.`
    : "";

  const raw = await askClaude(
    `You are a web design consultant. Given a ${industry} business, recommend the top 3 website templates from this list:

${templateList}

${voiceClause}

Return ONLY a JSON array of objects with templateId, name, reason (1 sentence), and score (1-10):
[{"templateId":"minimal","name":"Minimal","reason":"...","score":9}]`
  );

  try {
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]) as TemplateRecommendation[];
  } catch {
    // fallback
  }
  return [];
}

export async function analyzeVoice(
  description: string
): Promise<VoiceAnalysis> {
  const raw = await askClaude(
    `You are a brand strategist. Analyze this brand voice description and provide insights:

"${description}"

Return ONLY a JSON object:
{"tone":"one or two word tone descriptor","personality":"2-3 sentence personality summary","sampleGreeting":"A sample customer-facing greeting message in this voice (1-2 sentences)"}

Be specific and creative — don't be generic.`
  );

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as VoiceAnalysis;
  } catch {
    // fallback
  }
  return {
    tone: "Professional",
    personality: "A balanced and approachable brand personality.",
    sampleGreeting: "Welcome! We're glad you're here.",
  };
}

export async function enhanceProductDescription(
  productName: string,
  currentDescription: string,
  brandVoice?: string
): Promise<string> {
  const voiceClause = brandVoice
    ? `Write in this brand voice: ${brandVoice}.`
    : "";

  const raw = await askClaude(
    `You are a copywriter. Enhance this product description for "${productName}":

Current: "${currentDescription}"

${voiceClause}

Write a compelling 2-3 sentence product description. Return ONLY the description text, no quotes or explanation.`
  );

  return raw.trim();
}

export async function generateInitialContent(brand: {
  name: string;
  tagline?: string;
  industry?: string;
  brandVoice?: string;
  products?: Array<{ name: string; description?: string }>;
}): Promise<{
  heroHeadline: string;
  heroSubtext: string;
  aboutCopy: string;
  productDescriptions: Array<{ name: string; description: string }>;
  chatbotGreeting: string;
  faqEntries: Array<{ question: string; answer: string }>;
}> {
  const productNames =
    brand.products?.map((p) => p.name).join(", ") || "general products";

  const raw = await askClaude(
    `You are a content writer for "${brand.name}"${brand.industry ? ` in the ${brand.industry} industry` : ""}.
${brand.tagline ? `Tagline: "${brand.tagline}"` : ""}
${brand.brandVoice ? `Brand voice: ${brand.brandVoice}` : ""}
Products: ${productNames}

Generate initial website content. Return ONLY valid JSON:
{
  "heroHeadline": "compelling hero headline (max 10 words)",
  "heroSubtext": "hero subtext paragraph (2-3 sentences)",
  "aboutCopy": "about page copy (3-4 sentences)",
  "productDescriptions": [{"name":"product name","description":"2-sentence description"}],
  "chatbotGreeting": "friendly chatbot greeting (1-2 sentences)",
  "faqEntries": [{"question":"FAQ question","answer":"concise answer"}]
}

Generate 3 FAQ entries. If products exist, generate descriptions for up to 3.`
  );

  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch {
    // fallback
  }

  return {
    heroHeadline: `Welcome to ${brand.name}`,
    heroSubtext: brand.tagline || `Discover what makes ${brand.name} special.`,
    aboutCopy: `${brand.name} is dedicated to delivering exceptional experiences.`,
    productDescriptions: [],
    chatbotGreeting: `Hi there! Welcome to ${brand.name}. How can I help you today?`,
    faqEntries: [
      {
        question: "What do you offer?",
        answer: `We offer a range of quality products and services. Browse our catalog to learn more.`,
      },
      {
        question: "How can I contact you?",
        answer: "You can reach us through this chat or via our contact page.",
      },
      {
        question: "What are your hours?",
        answer: "We're available 24/7 through our online channels.",
      },
    ],
  };
}
