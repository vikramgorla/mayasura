import { NextRequest, NextResponse } from 'next/server';
import { getBrand, getBlogPosts, createBlogPost } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = getBrand(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const publishedOnly = request.nextUrl.searchParams.get('published') === 'true';
    const posts = getBlogPosts(id, publishedOnly);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = getBrand(id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const postId = nanoid(12);

    createBlogPost({
      id: postId,
      brand_id: id,
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt,
      category: body.category,
      tags: body.tags ? JSON.stringify(body.tags) : undefined,
      status: body.status || 'draft',
      published_at: body.status === 'published' ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ post: { id: postId, slug, ...body } }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
