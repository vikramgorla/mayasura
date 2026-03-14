import { NextRequest, NextResponse } from 'next/server';
import { getBrand, getProductsByBrand, getContentByBrand } from '@/lib/db';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface BrandRow {
  id: string;
  name: string;
  industry: string | null;
  description: string | null;
  brand_voice: string | null;
  tagline: string | null;
  channels: string;
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
    const brand = getBrand(id) as BrandRow | undefined;
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const { type } = body;

    const products = getProductsByBrand(id) as ProductRow[];
    const content = getContentByBrand(id);
    const channels = JSON.parse(brand.channels || '[]');

    const brandContext = `Brand: ${brand.name}
Industry: ${brand.industry || 'Not specified'}
Tagline: ${brand.tagline || 'None'}
Description: ${brand.description || 'None'}
Voice: ${brand.brand_voice || 'Not defined'}
Active channels: ${channels.join(', ')}
Products: ${products.map(p => `${p.name} ($${p.price || 'TBD'})`).join(', ') || 'None'}
Content pieces: ${content.length}`;

    const prompts: Record<string, string> = {
      'brand-strategy': `Analyze this brand and provide a strategic assessment:
${brandContext}

Return JSON: {
  "strengths": ["strength1", "strength2", "strength3"],
  "opportunities": ["opp1", "opp2", "opp3"],
  "positioning": "one paragraph about brand positioning",
  "recommendations": ["rec1", "rec2", "rec3"],
  "competitiveAdvantage": "what makes this brand unique"
}`,
      'competitor-analysis': `Based on this brand, identify likely competitors and suggest differentiation strategies:
${brandContext}

Return JSON: {
  "likelyCompetitors": ["competitor1", "competitor2", "competitor3"],
  "differentiators": ["diff1", "diff2", "diff3"],
  "marketGaps": ["gap1", "gap2"],
  "positioningStatement": "a unique positioning statement"
}`,
      'seo-suggestions': `Suggest SEO optimization strategies for this brand:
${brandContext}

Return JSON: {
  "primaryKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "longTailKeywords": ["phrase1", "phrase2", "phrase3"],
  "contentTopics": ["topic1", "topic2", "topic3"],
  "metaDescription": "suggested meta description",
  "titleTag": "suggested page title"
}`,
      'content-calendar': `Create a 2-week content calendar for this brand:
${brandContext}

Return JSON: {
  "calendar": [
    {"day": 1, "type": "blog|social|email", "title": "...", "description": "..."},
    {"day": 2, "type": "...", "title": "...", "description": "..."}
  ],
  "strategy": "overall content strategy summary"
}`,
      'brand-consistency': `Analyze if this brand has consistent messaging across its elements:
${brandContext}

Return JSON: {
  "score": 75,
  "strengths": ["what's consistent"],
  "issues": ["what's inconsistent"],
  "suggestions": ["how to improve"]
}`,
    };

    const prompt = prompts[type];
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid strategy type' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    try {
      const match = text.match(/\{[\s\S]*\}/);
      const result = match ? JSON.parse(match[0]) : { error: 'Failed to parse response' };
      return NextResponse.json({ result, type });
    } catch {
      return NextResponse.json({ result: text, type });
    }
  } catch (error) {
    console.error('Strategy error:', error);
    return NextResponse.json({ error: 'Failed to generate strategy' }, { status: 500 });
  }
}
