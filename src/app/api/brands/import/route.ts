import { NextRequest, NextResponse } from 'next/server';
import { createBrand, createProduct, createContent, createBlogPost, setBrandSetting, upsertBrandPage, createChatbotFaq, addActivity, getBrand } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

// Validation helpers
function isString(v: unknown): v is string {
  return typeof v === 'string';
}
function isNumber(v: unknown): v is number {
  return typeof v === 'number';
}

interface ImportResult {
  success: boolean;
  brandId: string;
  brandName: string;
  imported: {
    products: number;
    content: number;
    blogPosts: number;
    pages: number;
    faqs: number;
    settings: number;
  };
  warnings: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { error: authErr, session } = await requireAuth();
    if (authErr) return authErr;

    const body = await request.json();

    // ── Validation ──────────────────────────────────────────────
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body — expected JSON object' }, { status: 400 });
    }

    if (!body.version) {
      return NextResponse.json({ error: 'Invalid import file: missing version field' }, { status: 400 });
    }

    if (!body.brand || typeof body.brand !== 'object') {
      return NextResponse.json({ error: 'Invalid import file: missing brand object' }, { status: 400 });
    }

    const brandData = body.brand;
    if (!isString(brandData.name) || !brandData.name.trim()) {
      return NextResponse.json({ error: 'Invalid import file: brand.name is required' }, { status: 400 });
    }

    const warnings: string[] = [];
    const counters = { products: 0, content: 0, blogPosts: 0, pages: 0, faqs: 0, settings: 0 };

    // ── Create Brand ─────────────────────────────────────────────
    const newBrandId = nanoid(12);
    const baseSlug = (brandData.slug || brandData.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);
    const slug = `${baseSlug}-${nanoid(4)}`;

    createBrand({
      id: newBrandId,
      name: `${brandData.name.trim()} (Imported)`,
      tagline: isString(brandData.tagline) ? brandData.tagline : undefined,
      description: isString(brandData.description) ? brandData.description : undefined,
      industry: isString(brandData.industry) ? brandData.industry : undefined,
      primary_color: isString(brandData.primary_color) ? brandData.primary_color : undefined,
      secondary_color: isString(brandData.secondary_color) ? brandData.secondary_color : undefined,
      accent_color: isString(brandData.accent_color) ? brandData.accent_color : undefined,
      font_heading: isString(brandData.font_heading) ? brandData.font_heading : undefined,
      font_body: isString(brandData.font_body) ? brandData.font_body : undefined,
      brand_voice: isString(brandData.brand_voice) ? brandData.brand_voice : undefined,
      channels: isString(brandData.channels) ? brandData.channels : undefined,
      status: 'draft',
      user_id: session!.userId,
      slug,
    });

    // ── Import Products ──────────────────────────────────────────
    const products = Array.isArray(body.products) ? body.products : [];
    for (const product of products) {
      try {
        if (!isString(product.name)) { warnings.push(`Skipped product: missing name`); continue; }
        createProduct({
          id: nanoid(12),
          brand_id: newBrandId,
          name: product.name,
          description: isString(product.description) ? product.description : '',
          price: isNumber(product.price) ? product.price : 0,
          currency: isString(product.currency) ? product.currency : 'USD',
          image_url: isString(product.image_url) ? product.image_url : undefined,
          category: isString(product.category) ? product.category : undefined,
          sort_order: isNumber(product.sort_order) ? product.sort_order : counters.products,
        });
        counters.products++;
      } catch (e) {
        warnings.push(`Skipped product "${product.name}": ${e instanceof Error ? e.message : 'unknown error'}`);
      }
    }

    // ── Import Content ───────────────────────────────────────────
    const content = Array.isArray(body.content) ? body.content : [];
    for (const item of content) {
      try {
        if (!isString(item.type) || !isString(item.title)) { warnings.push('Skipped content item: missing type or title'); continue; }
        createContent({
          id: nanoid(12),
          brand_id: newBrandId,
          type: item.type,
          title: item.title,
          body: isString(item.body) ? item.body : '',
          metadata: item.metadata,
        });
        counters.content++;
      } catch (e) {
        warnings.push(`Skipped content "${item.title}": ${e instanceof Error ? e.message : 'unknown error'}`);
      }
    }

    // ── Import Blog Posts ────────────────────────────────────────
    const blogPosts = Array.isArray(body.blogPosts) ? body.blogPosts : [];
    for (const post of blogPosts) {
      try {
        if (!isString(post.title)) { warnings.push('Skipped blog post: missing title'); continue; }
        const postSlug = isString(post.slug)
          ? `${post.slug.replace(/[^a-z0-9-]/g, '-')}-${nanoid(4)}`
          : `${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(4)}`;
        createBlogPost({
          id: nanoid(12),
          brand_id: newBrandId,
          title: post.title,
          slug: postSlug,
          content: isString(post.content) ? post.content : '',
          excerpt: isString(post.excerpt) ? post.excerpt : undefined,
          category: isString(post.category) ? post.category : undefined,
          tags: isString(post.tags) ? post.tags : undefined,
          status: 'draft',
        });
        counters.blogPosts++;
      } catch (e) {
        warnings.push(`Skipped post "${post.title}": ${e instanceof Error ? e.message : 'unknown error'}`);
      }
    }

    // ── Import Settings ──────────────────────────────────────────
    const settings = body.settings && typeof body.settings === 'object' ? body.settings : {};
    for (const [key, value] of Object.entries(settings)) {
      try {
        setBrandSetting(newBrandId, key, String(value));
        counters.settings++;
      } catch { /* skip */ }
    }

    // ── Import Pages ─────────────────────────────────────────────
    const pages = Array.isArray(body.pages) ? body.pages : [];
    for (const page of pages) {
      try {
        if (!isString(page.slug) || !isString(page.title)) { warnings.push('Skipped page: missing slug or title'); continue; }
        upsertBrandPage({
          id: nanoid(12),
          brand_id: newBrandId,
          slug: page.slug,
          title: page.title,
          content: isString(page.content) ? page.content : '',
          is_published: page.is_published ? 1 : 0,
          sort_order: isNumber(page.sort_order) ? page.sort_order : 0,
        });
        counters.pages++;
      } catch { /* skip */ }
    }

    // ── Import FAQs ──────────────────────────────────────────────
    const faqs = Array.isArray(body.faqs) ? body.faqs : [];
    for (const faq of faqs) {
      try {
        if (!isString(faq.question) || !isString(faq.answer)) { warnings.push('Skipped FAQ: missing question or answer'); continue; }
        createChatbotFaq({
          id: nanoid(12),
          brand_id: newBrandId,
          question: faq.question,
          answer: faq.answer,
          sort_order: isNumber(faq.sort_order) ? faq.sort_order : counters.faqs,
        });
        counters.faqs++;
      } catch { /* skip */ }
    }

    // ── Activity Log ─────────────────────────────────────────────
    addActivity({
      id: nanoid(12),
      brand_id: newBrandId,
      type: 'import',
      description: `Brand data imported from Mayasura ${body.version} export`,
      metadata: JSON.stringify({ ...counters, sourceVersion: body.version, warnings: warnings.length }),
    });

    const result: ImportResult = {
      success: true,
      brandId: newBrandId,
      brandName: `${brandData.name.trim()} (Imported)`,
      imported: counters,
      warnings,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Brand import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ── Clone Brand ──────────────────────────────────────────────────
// POST /api/brands/import?clone=<sourceBrandId>
// Duplicates an existing brand as a new one
export async function PUT(request: NextRequest) {
  try {
    const { error: authErr, session } = await requireAuth();
    if (authErr) return authErr;

    const { searchParams } = new URL(request.url);
    const sourceBrandId = searchParams.get('clone');
    if (!sourceBrandId) {
      return NextResponse.json({ error: 'Missing clone parameter' }, { status: 400 });
    }

    // Fetch the export data for the source brand
    const { getFullBrandExport } = await import('@/lib/db');
    const exportData = getFullBrandExport(sourceBrandId);
    if (!exportData || !exportData.brand) {
      return NextResponse.json({ error: 'Source brand not found' }, { status: 404 });
    }

    const brandData = exportData.brand as Record<string, unknown>;
    const newBrandId = nanoid(12);
    const baseSlug = (String(brandData.slug || brandData.name || 'brand'))
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

    createBrand({
      id: newBrandId,
      name: `${brandData.name} (Clone)`,
      tagline: isString(brandData.tagline) ? brandData.tagline : undefined,
      description: isString(brandData.description) ? brandData.description : undefined,
      industry: isString(brandData.industry) ? brandData.industry : undefined,
      primary_color: isString(brandData.primary_color) ? brandData.primary_color : undefined,
      secondary_color: isString(brandData.secondary_color) ? brandData.secondary_color : undefined,
      accent_color: isString(brandData.accent_color) ? brandData.accent_color : undefined,
      font_heading: isString(brandData.font_heading) ? brandData.font_heading : undefined,
      font_body: isString(brandData.font_body) ? brandData.font_body : undefined,
      brand_voice: isString(brandData.brand_voice) ? brandData.brand_voice : undefined,
      channels: isString(brandData.channels) ? brandData.channels : undefined,
      status: 'draft',
      user_id: session!.userId,
      slug: `${baseSlug}-clone-${nanoid(4)}`,
    });

    // Clone products
    let productCount = 0;
    const products = Array.isArray(exportData.products) ? exportData.products : [];
    for (const p of products) {
      try {
        const prod = p as Record<string, unknown>;
        createProduct({
          id: nanoid(12),
          brand_id: newBrandId,
          name: String(prod.name || 'Product'),
          description: isString(prod.description) ? prod.description : '',
          price: isNumber(prod.price) ? prod.price : 0,
          currency: isString(prod.currency) ? prod.currency : 'USD',
          image_url: isString(prod.image_url) ? prod.image_url : undefined,
          category: isString(prod.category) ? prod.category : undefined,
          sort_order: isNumber(prod.sort_order) ? prod.sort_order : productCount,
        });
        productCount++;
      } catch { /* skip */ }
    }

    // Clone blog posts
    let blogCount = 0;
    const blogPosts = Array.isArray(exportData.blogPosts) ? exportData.blogPosts : [];
    for (const post of blogPosts) {
      try {
        const p = post as Record<string, unknown>;
        createBlogPost({
          id: nanoid(12),
          brand_id: newBrandId,
          title: String(p.title || 'Post'),
          slug: `${String(p.slug || 'post')}-${nanoid(4)}`,
          content: isString(p.content) ? p.content : '',
          excerpt: isString(p.excerpt) ? p.excerpt : undefined,
          category: isString(p.category) ? p.category : undefined,
          tags: isString(p.tags) ? p.tags : undefined,
          status: 'draft',
        });
        blogCount++;
      } catch { /* skip */ }
    }

    // Clone settings
    const settings = exportData.settings && typeof exportData.settings === 'object' ? exportData.settings as Record<string, unknown> : {};
    for (const [key, value] of Object.entries(settings)) {
      try { setBrandSetting(newBrandId, key, String(value)); } catch { /* skip */ }
    }

    addActivity({
      id: nanoid(12),
      brand_id: newBrandId,
      type: 'import',
      description: `Brand cloned from ${sourceBrandId}`,
      metadata: JSON.stringify({ clonedFrom: sourceBrandId, products: productCount, blogPosts: blogCount }),
    });

    return NextResponse.json({
      success: true,
      brandId: newBrandId,
      brandName: `${brandData.name} (Clone)`,
      clonedFrom: sourceBrandId,
      imported: { products: productCount, blogPosts: blogCount },
    });
  } catch (error) {
    console.error('Brand clone error:', error);
    return NextResponse.json(
      { error: 'Clone failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
