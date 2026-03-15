import { NextRequest, NextResponse } from 'next/server';
import { getProductsByBrand } from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';
import Anthropic from '@anthropic-ai/sdk';

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured. Add it in Settings → Integrations or set it as an environment variable.');
  }
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

interface BrandRow {
  id: string;
  name: string;
  industry: string | null;
  description: string | null;
  brand_voice: string | null;
  tagline: string | null;
  [key: string]: unknown;
}

interface ProductRow {
  name: string;
  description: string | null;
  price: number | null;
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, brand: rawBrand } = await requireBrandOwner(id);
    if (error) return error;
    const brand = rawBrand as unknown as BrandRow;

    const body = await request.json();
    const { topic } = body; // optional topic/theme

    const products = getProductsByBrand(id) as ProductRow[];

    const brandContext = `Brand: ${brand.name}
Industry: ${brand.industry || 'General'}
Tagline: ${brand.tagline || 'None'}
Description: ${brand.description || 'A brand building its digital presence'}
Voice: ${brand.brand_voice || 'Professional yet friendly'}
Products: ${products.slice(0, 5).map(p => p.name).join(', ') || 'None yet'}`;

    const topicLine = topic ? `\nTopic/theme to focus on: ${topic}` : '';

    const prompt = `Generate social media posts for this brand across 4 platforms. Each post should be platform-optimized with the right tone, length, and formatting.

${brandContext}${topicLine}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "posts": [
    {
      "platform": "twitter",
      "platformLabel": "X (Twitter)",
      "content": "The actual post text (max 280 chars)",
      "characterCount": 142,
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
      "bestTime": "Tue/Thu 9-11 AM",
      "tip": "Short actionable tip for this platform"
    },
    {
      "platform": "instagram",
      "platformLabel": "Instagram",
      "content": "Longer caption with emojis and line breaks. Use newlines for readability.\\n\\nInclude a call to action.",
      "characterCount": 250,
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
      "bestTime": "Mon/Wed/Fri 11 AM - 1 PM",
      "tip": "Tip for Instagram engagement"
    },
    {
      "platform": "linkedin",
      "platformLabel": "LinkedIn",
      "content": "Professional post with insights. Can be longer and more thought-leadership focused.\\n\\nInclude industry insights and a question to drive engagement.",
      "characterCount": 350,
      "hashtags": ["#ProfessionalTag1", "#IndustryTag"],
      "bestTime": "Tue-Thu 7-8 AM or 12 PM",
      "tip": "LinkedIn tip"
    },
    {
      "platform": "facebook",
      "platformLabel": "Facebook",
      "content": "Conversational and community-focused post. Can include a question or poll idea.",
      "characterCount": 200,
      "hashtags": ["#tag1", "#tag2"],
      "bestTime": "Wed-Fri 1-4 PM",
      "tip": "Facebook engagement tip"
    }
  ],
  "theme": "The overall theme/angle used for these posts",
  "contentCalendarTip": "A tip about how to schedule these posts for maximum impact"
}`;

    const message = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const result = JSON.parse(match[0]);
    return NextResponse.json(result);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate social posts', details: errorMessage }, { status: 500 });
  }
}
