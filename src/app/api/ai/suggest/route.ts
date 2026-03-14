import { NextRequest, NextResponse } from 'next/server';
import { suggestBrandNames, suggestTaglines, generateProductDescription, analyzeBrandVoice, generateColorPalette, generateCopy } from '@/lib/ai';
import { WEBSITE_TEMPLATES, suggestTemplateForIndustry } from '@/lib/website-templates';

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

      case 'website-template': {
        const { industry, brandVoice } = body;
        if (!industry) {
          return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
        }

        // Get ranked template IDs based on industry
        const ranked = suggestTemplateForIndustry(industry);

        // Build response with full template info and reasoning
        const recommendations = ranked.map((id, index) => {
          const template = WEBSITE_TEMPLATES.find(t => t.id === id)!;
          let reason = '';

          if (index === 0) {
            reason = `Best match for ${industry}. ${template.description}`;
          } else if (index === 1) {
            reason = `Strong alternative. ${template.description}`;
          } else {
            reason = template.description;
          }

          if (brandVoice) {
            const voiceLower = brandVoice.toLowerCase();
            if (voiceLower.includes('minimal') && id === 'minimal') reason += ' Aligns with your minimal brand voice.';
            if (voiceLower.includes('bold') && id === 'bold') reason += ' Matches your bold brand personality.';
            if (voiceLower.includes('playful') && id === 'playful') reason += ' Fits your playful tone.';
            if (voiceLower.includes('professional') && id === 'classic') reason += ' Suits your professional voice.';
          }

          return {
            templateId: id,
            name: template.name,
            description: template.description,
            bestFor: template.bestFor,
            reason,
            rank: index + 1,
          };
        });

        return NextResponse.json({ recommendations });
      }

      default:
        return NextResponse.json({ error: 'Invalid suggestion type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in AI suggest:', error);
    return NextResponse.json({ error: 'AI suggestion failed' }, { status: 500 });
  }
}
