import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, getProductsByBrand, getBlogPosts, getBrandPages } from '@/lib/db';
import { Brand } from '@/lib/types';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  category: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published_at: string;
}

interface BrandPage {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  is_published: number;
}

function matchesQuery(text: string | null | undefined, query: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(query.toLowerCase());
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], blogPosts: [], pages: [] });
    }

    const brand = getBrandBySlug(slug) as Brand | undefined;
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const allProducts = getProductsByBrand(brand.id) as Product[];
    const allBlogPosts = getBlogPosts(brand.id, true) as BlogPost[];
    const allPages = getBrandPages(brand.id, true) as BrandPage[];

    const products = allProducts
      .filter((p) => matchesQuery(p.name, query) || matchesQuery(p.description, query))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        currency: p.currency,
        image_url: p.image_url,
        category: p.category,
      }));

    const blogPosts = allBlogPosts
      .filter((p) => matchesQuery(p.title, query) || matchesQuery(p.excerpt, query))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        category: p.category,
        published_at: p.published_at,
      }));

    const pages = allPages
      .filter((p) => matchesQuery(p.title, query) || matchesQuery(p.content, query))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
      }));

    return NextResponse.json({ products, blogPosts, pages });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
