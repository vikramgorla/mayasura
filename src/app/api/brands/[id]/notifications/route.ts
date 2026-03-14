import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');

    const notifications = getNotifications(id, limit, unreadOnly);
    const unreadCount = getUnreadNotificationCount(id);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
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

    if (body.markAllRead) {
      markAllNotificationsRead(id);
      return NextResponse.json({ success: true });
    }

    if (body.notificationId) {
      markNotificationRead(body.notificationId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
