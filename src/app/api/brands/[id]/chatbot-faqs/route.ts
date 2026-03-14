import { NextRequest, NextResponse } from 'next/server';
import { getChatbotFaqs, createChatbotFaq, updateChatbotFaq, deleteChatbotFaq } from '@/lib/db';
import { requireBrandOwner, sanitizeInput, sanitizeObject } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const faqs = getChatbotFaqs(id);
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
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
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const faqId = nanoid(12);
    createChatbotFaq({
      id: faqId,
      brand_id: id,
      question: sanitizeInput(body.question),
      answer: sanitizeInput(body.answer),
      sort_order: body.sort_order,
    });

    return NextResponse.json({ faq: { id: faqId, ...body } }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    const { faqId, ...updates } = body;

    if (!faqId) {
      return NextResponse.json({ error: 'faqId is required' }, { status: 400 });
    }

    updateChatbotFaq(faqId, sanitizeObject(updates));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    const { faqId } = body;

    if (!faqId) {
      return NextResponse.json({ error: 'faqId is required' }, { status: 400 });
    }

    deleteChatbotFaq(faqId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
