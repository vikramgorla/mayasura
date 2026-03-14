import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/auth';
import { incrementTokenVersion } from '@/lib/db';

export async function POST() {
  try {
    // Increment token version to invalidate all existing tokens for this user
    const session = await getSession();
    if (session) {
      incrementTokenVersion(session.userId);
    }

    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
