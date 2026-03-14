import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { hashPassword, createToken, setSessionCookie } from '@/lib/auth';
import { sanitizeInput } from '@/lib/api-auth';
import { nanoid } from 'nanoid';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a number';
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    // M2: Email format validation
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // M1: Stronger password policy
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    // Sanitize name
    const sanitizedName = sanitizeInput(name);
    if (sanitizedName.length > 200) {
      return NextResponse.json({ error: 'Name must be under 200 characters' }, { status: 400 });
    }

    const existing = getUserByEmail(email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const id = nanoid(12);
    const passwordHash = await hashPassword(password);

    createUser({ id, email: email.toLowerCase(), name: sanitizedName, password_hash: passwordHash });

    const token = await createToken({ userId: id, email: email.toLowerCase(), name: sanitizedName, tokenVersion: 0 });
    await setSessionCookie(token);

    return NextResponse.json({
      user: { id, email: email.toLowerCase(), name: sanitizedName },
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
