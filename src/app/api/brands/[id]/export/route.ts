import { NextRequest, NextResponse } from 'next/server';
import { getFullBrandExport, createBrand, createProduct, createContent, createBlogPost, setBrandSetting, upsertBrandPage, createChatbotFaq, addActivity } from '@/lib/db';
import { requireBrandOwner, requireAuth } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const exportData = getFullBrandExport(id);

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="mayasura-brand-${id}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting brand:', error);
    return NextResponse.json({ error: 'Failed to export brand' }, { status: 500 });
  }
}

// Import brand data
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // For import, we just check auth - id can be 'new' for creating new brand from import
    const { error: authErr, session } = await requireAuth();
    if (authErr) return authErr;

    const importData = await request.json();

    if (!importData.brand || !importData.version) {
      return NextResponse.json({ error: 'Invalid import file format' }, { status: 400 });
    }

    const brandData = importData.brand;
    const newBrandId = id === 'new' ? nanoid(12) : id;

    // If importing as new brand, create it
    if (id === 'new') {
      const slug = `${brandData.slug || brandData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-imported-${nanoid(4)}`;
      createBrand({
        id: newBrandId,
        name: `${brandData.name} (Imported)`,
        tagline: brandData.tagline,
        description: brandData.description,
        industry: brandData.industry,
        primary_color: brandData.primary_color,
        secondary_color: brandData.secondary_color,
        accent_color: brandData.accent_color,
        font_heading: brandData.font_heading,
        font_body: brandData.font_body,
        brand_voice: brandData.brand_voice,
        channels: brandData.channels,
        status: 'draft',
        user_id: session!.userId,
        slug,
      });
    }

    // Import products
    const products = importData.products || [];
    for (const product of products) {
      try {
        createProduct({
          id: nanoid(12),
          brand_id: newBrandId,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          image_url: product.image_url,
          category: product.category,
          sort_order: product.sort_order,
        });
      } catch { /* skip duplicates */ }
    }

    // Import content
    const content = importData.content || [];
    for (const item of content) {
      try {
        createContent({
          id: nanoid(12),
          brand_id: newBrandId,
          type: item.type,
          title: item.title,
          body: item.body,
          metadata: item.metadata,
        });
      } catch { /* skip duplicates */ }
    }

    // Import blog posts
    const blogPosts = importData.blogPosts || [];
    for (const post of blogPosts) {
      try {
        createBlogPost({
          id: nanoid(12),
          brand_id: newBrandId,
          title: post.title,
          slug: `${post.slug}-${nanoid(4)}`,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          status: 'draft',
        });
      } catch { /* skip duplicates */ }
    }

    // Import settings
    const settings = importData.settings || {};
    for (const [key, value] of Object.entries(settings)) {
      setBrandSetting(newBrandId, key, value as string);
    }

    // Import pages
    const pages = importData.pages || [];
    for (const page of pages) {
      try {
        upsertBrandPage({
          id: nanoid(12),
          brand_id: newBrandId,
          slug: page.slug,
          title: page.title,
          content: page.content,
          is_published: page.is_published,
          sort_order: page.sort_order,
        });
      } catch { /* skip duplicates */ }
    }

    // Import FAQs
    const faqs = importData.faqs || [];
    for (const faq of faqs) {
      try {
        createChatbotFaq({
          id: nanoid(12),
          brand_id: newBrandId,
          question: faq.question,
          answer: faq.answer,
          sort_order: faq.sort_order,
        });
      } catch { /* skip duplicates */ }
    }

    // Log activity
    addActivity({
      id: nanoid(12),
      brand_id: newBrandId,
      type: 'import',
      description: `Brand data imported from ${importData.version} export`,
      metadata: JSON.stringify({
        products: products.length,
        content: content.length,
        blogPosts: blogPosts.length,
      }),
    });

    return NextResponse.json({
      success: true,
      brandId: newBrandId,
      imported: {
        products: products.length,
        content: content.length,
        blogPosts: blogPosts.length,
        pages: pages.length,
        faqs: faqs.length,
      },
    });
  } catch (error) {
    console.error('Error importing brand:', error);
    return NextResponse.json({ error: 'Failed to import brand data' }, { status: 500 });
  }
}
