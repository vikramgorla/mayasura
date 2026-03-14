import { NextRequest, NextResponse } from 'next/server';
import { getBrand, createTicket, getTicketsByBrand, getTicket, updateTicket, addTicketMessage, getTicketMessages, getTicketStats } from '@/lib/db';
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
    const status = searchParams.get('status') || undefined;
    const ticketId = searchParams.get('ticketId');

    if (ticketId) {
      const ticket = getTicket(ticketId);
      const messages = getTicketMessages(ticketId);
      return NextResponse.json({ ticket, messages });
    }

    const tickets = getTicketsByBrand(id, status);
    const stats = getTicketStats(id);
    return NextResponse.json({ tickets, stats });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
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

    // If adding a message to existing ticket
    if (body.ticketId && body.message) {
      const msgId = nanoid(12);
      addTicketMessage({
        id: msgId,
        ticket_id: body.ticketId,
        role: body.role || 'agent',
        content: body.message,
      });
      
      // Optionally update status
      if (body.status) {
        updateTicket(body.ticketId, { status: body.status });
      }

      return NextResponse.json({ success: true });
    }

    // Create new ticket
    if (!body.customer_name || !body.customer_email || !body.subject) {
      return NextResponse.json({ error: 'Customer name, email, and subject are required' }, { status: 400 });
    }

    const ticketId = nanoid(12);
    createTicket({
      id: ticketId,
      brand_id: id,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      subject: body.subject,
      category: body.category,
      priority: body.priority || 'medium',
    });

    // Add initial message if provided
    if (body.message) {
      addTicketMessage({
        id: nanoid(12),
        ticket_id: ticketId,
        role: 'customer',
        content: body.message,
      });
    }

    return NextResponse.json({
      ticket: { id: ticketId, ...body, brand_id: id },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await request.json();
    
    if (!body.ticketId) {
      return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (body.status) updates.status = body.status;
    if (body.priority) updates.priority = body.priority;
    if (body.category) updates.category = body.category;
    if (body.satisfaction_rating !== undefined) updates.satisfaction_rating = body.satisfaction_rating;

    updateTicket(body.ticketId, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
