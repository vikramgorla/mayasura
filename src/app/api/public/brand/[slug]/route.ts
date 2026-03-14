import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, getProductsByBrand, getBlogPosts, getBrandPages } from '@/lib/db';
import { Brand } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const brand = getBrandBySlug(slug) as Brand | undefined;
    
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const products = getProductsByBrand(brand.id);
    const blogPosts = getBlogPosts(brand.id, true); // published only
    const pages = getBrandPages(brand.id, true); // published only

    return NextResponse.json({
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        tagline: brand.tagline,
        description: brand.description,
        industry: brand.industry,
        logo_url: brand.logo_url,
        primary_color: brand.primary_color,
        secondary_color: brand.secondary_color,
        accent_color: brand.accent_color,
        font_heading: brand.font_heading,
        font_body: brand.font_body,
        brand_voice: brand.brand_voice,
        channels: brand.channels,
        status: brand.status,
      },
      products,
      blogPosts,
      pages,
    });
  } catch (error) {
    console.error('Error fetching public brand:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
