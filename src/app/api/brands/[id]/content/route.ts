import { NextRequest, NextResponse } from 'next/server';
import { getBrand, createContent, getContentByBrand, deleteContent } from '@/lib/db';
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const content = getContentByBrand(id, type);
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
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
    if (!body.type) {
      return NextResponse.json({ error: 'Content type is required' }, { status: 400 });
    }

    const contentId = nanoid(12);
    createContent({
      id: contentId,
      brand_id: id,
      type: body.type,
      title: body.title,
      body: body.body,
      metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
    });

    return NextResponse.json({ content: { id: contentId, ...body, brand_id: id } }, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    if (!contentId) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 });
    }
    deleteContent(contentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
