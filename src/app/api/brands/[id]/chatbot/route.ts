import { NextRequest, NextResponse } from 'next/server';
import { getBrand, getProductsByBrand, addChatMessage, getChatHistory } from '@/lib/db';
import { chatWithBrand } from '@/lib/ai';
import { nanoid } from 'nanoid';

interface BrandRow {
  id: string;
  name: string;
  brand_voice: string | null;
  [key: string]: unknown;
}

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = getBrand(id) as BrandRow | undefined;
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const chatSessionId = sessionId || nanoid(12);
    const products = getProductsByBrand(id) as ProductRow[];
    const history = getChatHistory(id, chatSessionId) as ChatRow[];

    // Save user message
    addChatMessage({
      id: nanoid(12),
      brand_id: id,
      role: 'user',
      content: message,
      session_id: chatSessionId,
    });

    // Get AI response
    const response = await chatWithBrand({
      brandName: brand.name,
      brandVoice: brand.brand_voice || undefined,
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
      brand_id: id,
      role: 'assistant',
      content: response,
      session_id: chatSessionId,
    });

    return NextResponse.json({
      response,
      sessionId: chatSessionId,
    });
  } catch (error) {
    console.error('Error in chatbot:', error);
    return NextResponse.json({ error: 'Failed to process chat message' }, { status: 500 });
  }
}
