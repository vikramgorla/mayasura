import { NextRequest, NextResponse } from 'next/server';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  getProductsByBrand,
} from '@/lib/db';
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const testimonials = getTestimonials(id);
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, brand: rawBrand } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();

    // AI generation mode
    if (body.action === 'generate') {
      const brand = rawBrand as unknown as BrandRow;
      const products = getProductsByBrand(id) as ProductRow[];

      const brandContext = `Brand: ${brand.name}
Industry: ${brand.industry || 'General'}
Tagline: ${brand.tagline || 'None'}
Description: ${brand.description || 'A brand building its digital presence'}
Voice: ${brand.brand_voice || 'Professional yet friendly'}
Products: ${products.slice(0, 5).map(p => `${p.name}${p.description ? ` - ${p.description}` : ''}`).join('; ') || 'None yet'}`;

      const prompt = `Generate 3 realistic testimonials for this brand. They should feel authentic and specific, not generic. Reference actual products or services when possible.

${brandContext}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "testimonials": [
    {
      "author_name": "Full Name",
      "author_role": "Job Title",
      "author_company": "Company Name",
      "quote": "A specific, authentic-sounding testimonial that references the brand or its products",
      "rating": 5
    }
  ]
}

Make the testimonials diverse (different roles, companies, perspectives). Ratings should be 4 or 5.`;

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
    }

    // Reorder mode
    if (body.action === 'reorder' && Array.isArray(body.updates)) {
      reorderTestimonials(body.updates);
      const testimonials = getTestimonials(id);
      return NextResponse.json({ testimonials });
    }

    // Normal create
    const { author_name, author_role, author_company, quote, rating, avatar_url, featured } = body;

    if (!author_name || !quote) {
      return NextResponse.json({ error: 'author_name and quote are required' }, { status: 400 });
    }

    const testimonialId = crypto.randomUUID();
    createTestimonial({
      id: testimonialId,
      brand_id: id,
      author_name,
      author_role,
      author_company,
      quote,
      rating: rating ?? 5,
      avatar_url,
      featured: featured ?? 0,
    });

    const testimonials = getTestimonials(id);
    return NextResponse.json({ testimonials }, { status: 201 });
  } catch (err) {
    console.error('Error creating testimonial:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    const { testimonialId, ...updates } = body;

    if (!testimonialId) {
      return NextResponse.json({ error: 'testimonialId is required' }, { status: 400 });
    }

    updateTestimonial(testimonialId, updates);
    const testimonials = getTestimonials(id);
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const testimonialId = searchParams.get('testimonialId');

    if (!testimonialId) {
      return NextResponse.json({ error: 'testimonialId is required' }, { status: 400 });
    }

    deleteTestimonial(testimonialId);
    const testimonials = getTestimonials(id);
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
