import { NextRequest, NextResponse } from 'next/server';
import { getProductsByBrand, addChatMessage, getChatHistory } from '@/lib/db';
import { chatWithBrand } from '@/lib/ai';
import { requireBrandOwner, sanitizeInput } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

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
    const { error, brand } = await requireBrandOwner(id);
    if (error) return error;

    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const sanitizedMessage = sanitizeInput(message);
    const chatSessionId = sessionId || nanoid(12);
    const products = getProductsByBrand(id) as ProductRow[];
    const history = getChatHistory(id, chatSessionId) as ChatRow[];

    // Save user message
    addChatMessage({
      id: nanoid(12),
      brand_id: id,
      role: 'user',
      content: sanitizedMessage,
      session_id: chatSessionId,
    });

    // Get AI response
    const brandData = brand as unknown as { name: string; brand_voice: string | null };
    const response = await chatWithBrand({
      brandName: brandData.name,
      brandVoice: brandData.brand_voice || undefined,
      products: products.map(p => ({
        name: p.name,
        description: p.description || undefined,
        price: p.price || undefined,
      })),
      history: history.map(h => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      message: sanitizedMessage,
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
