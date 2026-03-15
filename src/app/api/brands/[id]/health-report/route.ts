import { NextRequest, NextResponse } from 'next/server';
import { getProductsByBrand, getContentByBrand, getStrategies, getBrandSettings } from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';
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
  template: string | null;
  primary_color: string | null;
  [key: string]: unknown;
}

interface ProductRow {
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  [key: string]: unknown;
}

interface ContentRow {
  type: string;
  title: string;
  body: string;
  status: string;
  [key: string]: unknown;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, brand: rawBrand } = await requireBrandOwner(id);
    if (error) return error;
    const brand = rawBrand as unknown as BrandRow;

    const products = getProductsByBrand(id) as ProductRow[];
    const content = getContentByBrand(id) as ContentRow[];
    const strategies = getStrategies(id);
    const settings = getBrandSettings(id);
    const channels = JSON.parse(brand.channels || '[]');

    const brandContext = `Brand: ${brand.name}
Industry: ${brand.industry || 'Not specified'}
Tagline: ${brand.tagline || 'None'}
Description: ${brand.description || 'None'}
Voice: ${brand.brand_voice || 'Not defined'}
Template: ${brand.template || 'Default'}
Primary Color: ${brand.primary_color || 'Not set'}
Active channels: ${channels.join(', ') || 'None'}
Products (${products.length}): ${products.slice(0, 10).map(p => `${p.name} - ${p.description?.slice(0, 50) || 'no desc'} ($${p.price || 'TBD'})`).join('; ') || 'None'}
Content pieces (${content.length}): ${content.slice(0, 10).map(c => `[${c.type}] ${c.title} (${c.status})`).join('; ') || 'None'}
Published content: ${content.filter(c => c.status === 'published').length}
Draft content: ${content.filter(c => c.status === 'draft').length}
Strategy reports generated: ${strategies.length}
Custom settings: ${Object.keys(settings).length} configured
Has custom domain: ${settings.custom_domain ? 'Yes' : 'No'}`;

    const prompt = `You are a brand consultant. Analyze this brand and generate a comprehensive Brand Health Report.

${brandContext}

Score each dimension from 0-100 and provide specific, actionable feedback. Be honest — if something is missing, score it low.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "overallScore": 72,
  "overallGrade": "B",
  "summary": "2-3 sentence executive summary of brand health",
  "dimensions": {
    "onlinePresence": {
      "score": 75,
      "label": "Online Presence",
      "feedback": "Specific feedback about their online presence",
      "recommendations": ["actionable recommendation 1", "actionable recommendation 2"]
    },
    "contentQuality": {
      "score": 60,
      "label": "Content Quality",
      "feedback": "Specific feedback",
      "recommendations": ["rec1", "rec2"]
    },
    "seoReadiness": {
      "score": 45,
      "label": "SEO Readiness",
      "feedback": "Specific feedback",
      "recommendations": ["rec1", "rec2"]
    },
    "visualConsistency": {
      "score": 80,
      "label": "Visual Consistency",
      "feedback": "Specific feedback",
      "recommendations": ["rec1", "rec2"]
    },
    "customerEngagement": {
      "score": 55,
      "label": "Customer Engagement",
      "feedback": "Specific feedback",
      "recommendations": ["rec1", "rec2"]
    }
  },
  "topPriorities": ["priority 1", "priority 2", "priority 3"],
  "strengths": ["strength 1", "strength 2"],
  "quickWins": ["quick win 1 that can be done today", "quick win 2"]
}`;

    const message = await client.messages.create({
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
    return NextResponse.json({ report: result });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate health report', details: errorMessage }, { status: 500 });
  }
}
