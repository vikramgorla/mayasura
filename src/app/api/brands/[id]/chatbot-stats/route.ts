import { NextRequest, NextResponse } from 'next/server';
import { requireBrandOwner } from '@/lib/api-auth';
import { getDb } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const db = getDb();

    // Count unique sessions and total messages
    const sessionCount = db.prepare(
      'SELECT COUNT(DISTINCT session_id) as count FROM chat_messages WHERE brand_id = ?'
    ).get(id) as { count: number } | undefined;

    const messageCount = db.prepare(
      'SELECT COUNT(*) as count FROM chat_messages WHERE brand_id = ?'
    ).get(id) as { count: number } | undefined;

    const totalSessions = sessionCount?.count || 0;
    const totalMessages = messageCount?.count || 0;
    const avgMessages = totalSessions > 0 ? totalMessages / totalSessions : 0;

    return NextResponse.json({
      stats: {
        totalSessions,
        totalMessages,
        avgMessages: Math.round(avgMessages * 10) / 10,
      },
    });
  } catch (error) {
    console.error('Chat stats error:', error);
    return NextResponse.json({ stats: { totalSessions: 0, totalMessages: 0, avgMessages: 0 } });
  }
}
