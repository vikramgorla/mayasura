import { NextRequest, NextResponse } from 'next/server';
import { getBrandBySlug, getProductsByBrand, addChatMessage, getChatHistory, getChatbotFaqs } from '@/lib/db';
import { chatWithBrand } from '@/lib/ai';
import { nanoid } from 'nanoid';
import { Brand } from '@/lib/types';

interface ProductRow {
  name: string;
  description: string | null;
  price: number | null;
  [key: string]: unknown;
}

interface ChatRow {
  role: string;
  content: string;
  [key: string]: unknown;
}

interface FaqRow {
  question: string;
  answer: string;
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const brand = getBrandBySlug(slug) as Brand | undefined;
    
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const chatSessionId = sessionId || nanoid(12);
    const products = getProductsByBrand(brand.id) as ProductRow[];
    const history = getChatHistory(brand.id, chatSessionId) as ChatRow[];
    const faqs = getChatbotFaqs(brand.id) as FaqRow[];

    // Save user message
    addChatMessage({
      id: nanoid(12),
      brand_id: brand.id,
      role: 'user',
      content: message,
      session_id: chatSessionId,
    });

    // Build FAQ context
    const faqContext = faqs.length > 0
      ? `\n\nFAQs:\n${faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}`
      : '';

    // Get AI response with FAQ context injected into brand voice
    const response = await chatWithBrand({
      brandName: brand.name,
      brandVoice: (brand.brand_voice || '') + faqContext,
      products: products.map(p => ({
        name: p.name,
        description: p.description || undefined,
        price: p.price || undefined,
      })),
      history: history.map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      message,
    });

    // Save assistant response
    addChatMessage({
      id: nanoid(12),
      brand_id: brand.id,
      role: 'assistant',
      content: response,
      session_id: chatSessionId,
    });

    return NextResponse.json({
      response,
      sessionId: chatSessionId,
    });
  } catch (error) {
    console.error('Error in public chatbot:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
