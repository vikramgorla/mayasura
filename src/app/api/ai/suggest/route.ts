import { NextRequest, NextResponse } from 'next/server';
import { suggestBrandNames, suggestTaglines, generateProductDescription, analyzeBrandVoice } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    switch (type) {
      case 'brand-names': {
        const { industry, keywords } = body;
        if (!industry) {
          return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
        }
        const names = await suggestBrandNames(industry, keywords || []);
        return NextResponse.json({ suggestions: names });
      }

      case 'taglines': {
        const { brandName, industry } = body;
        if (!brandName || !industry) {
          return NextResponse.json({ error: 'Brand name and industry required' }, { status: 400 });
        }
        const taglines = await suggestTaglines(brandName, industry);
        return NextResponse.json({ suggestions: taglines });
      }

      case 'product-description': {
        const { productName, brandName, brandVoice } = body;
        if (!productName || !brandName) {
          return NextResponse.json({ error: 'Product and brand name required' }, { status: 400 });
        }
        const description = await generateProductDescription(productName, brandName, brandVoice);
        return NextResponse.json({ description });
      }

      case 'brand-voice': {
        const { description } = body;
        if (!description) {
          return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }
        const voice = await analyzeBrandVoice(description);
        return NextResponse.json({ voice });
      }

      default:
        return NextResponse.json({ error: 'Invalid suggestion type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in AI suggest:', error);
    return NextResponse.json({ error: 'AI suggestion failed' }, { status: 500 });
  }
}
