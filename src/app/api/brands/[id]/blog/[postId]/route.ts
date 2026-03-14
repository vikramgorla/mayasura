import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/db';
import { requireBrandOwner, sanitizeObject } from '@/lib/api-auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const { id, postId } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const post = getBlogPostById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const { id, postId } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const post = getBlogPostById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const body = await request.json();

    // If publishing for the first time, set published_at
    if (body.status === 'published' && !(post as Record<string, unknown>).published_at) {
      body.published_at = new Date().toISOString();
    }

    // Stringify tags if array
    if (Array.isArray(body.tags)) {
      body.tags = JSON.stringify(body.tags);
    }

    const sanitized = sanitizeObject(body);
    updateBlogPost(postId, sanitized);
    const updated = getBlogPostById(postId);
    return NextResponse.json({ post: updated });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; postId: string }> }
) {
  try {
    const { id, postId } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const post = getBlogPostById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    deleteBlogPost(postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
