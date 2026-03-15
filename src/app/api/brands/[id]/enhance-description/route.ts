import { NextRequest, NextResponse } from 'next/server';
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
  brand_voice: string | null;
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
    const { productName, currentDescription, category, price } = body;

    if (!productName) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const prompt = `You are a copywriting expert. Enhance this product description to be more compelling, persuasive, and SEO-optimized.

Brand: ${brand.name}
Industry: ${brand.industry || 'General'}
Brand Voice: ${brand.brand_voice || 'Professional and engaging'}
Product: ${productName}
Category: ${category || 'General'}
Price: ${price ? `$${price}` : 'Not set'}
Current Description: ${currentDescription || 'No description yet'}

Requirements:
- Make it compelling and benefit-focused (not just features)
- Add relevant SEO keywords naturally
- Match the brand voice
- Keep it concise but impactful (2-4 sentences)
- Include a subtle call-to-action

Return ONLY valid JSON (no markdown, no code blocks):
{
  "enhanced": "The enhanced product description text",
  "seoKeywords": ["keyword1", "keyword2", "keyword3"],
  "improvements": ["What was improved 1", "What was improved 2", "What was improved 3"]
}`;

    const message = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
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
    return NextResponse.json({ error: 'Failed to enhance description', details: errorMessage }, { status: 500 });
  }
}
