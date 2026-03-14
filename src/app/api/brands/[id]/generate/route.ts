import { NextRequest, NextResponse } from 'next/server';
import { getProductsByBrand, createContent } from '@/lib/db';
import { generateContent } from '@/lib/ai';
import { requireBrandOwner } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

interface ProductRow {
  name: string;
  description: string | null;
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, brand } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    const { type, topic } = body;

    if (!type || !['blog', 'social', 'email', 'about', 'landing'].includes(type)) {
      return NextResponse.json({ error: 'Valid content type required (blog, social, email, about, landing)' }, { status: 400 });
    }

    const brandData = brand as unknown as { name: string; brand_voice: string | null };
    const products = getProductsByBrand(id) as ProductRow[];

    const result = await generateContent({
      brandName: brandData.name,
      brandVoice: brandData.brand_voice || undefined,
      type,
      topic,
      products: products.map(p => ({ name: p.name, description: p.description || undefined })),
    });

    // Save to database
    const contentId = nanoid(12);
    createContent({
      id: contentId,
      brand_id: id,
      type,
      title: result.title,
      body: result.body,
      metadata: JSON.stringify({ topic, generatedAt: new Date().toISOString() }),
    });

    return NextResponse.json({
      content: {
        id: contentId,
        type,
        title: result.title,
        body: result.body,
      },
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
