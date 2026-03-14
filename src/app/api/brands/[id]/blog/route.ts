import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/db';
import { requireBrandOwner, sanitizeInput } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

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
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const title = sanitizeInput(body.title);
    const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const postId = nanoid(12);

    createBlogPost({
      id: postId,
      brand_id: id,
      title,
      slug,
      content: body.content,
      excerpt: body.excerpt ? sanitizeInput(body.excerpt) : undefined,
      category: body.category ? sanitizeInput(body.category) : undefined,
      tags: body.tags ? JSON.stringify(body.tags) : undefined,
      status: body.status || 'draft',
      published_at: body.status === 'published' ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ post: { id: postId, slug, ...body, title } }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
