import { getSession } from './auth';
import { getBrand } from './db';
import { NextResponse } from 'next/server';

/**
 * Require authenticated session. Returns 401 if not logged in.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
      session: null as null,
    };
  }
  return { error: null, session };
}

/**
 * Require authenticated session AND ownership of the specified brand.
 * Returns 401 if not logged in, 404 if brand not found, 403 if not owner.
 */
export async function requireBrandOwner(brandId: string) {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
      session: null as null,
      brand: null as null,
    };
  }

  const brand = getBrand(brandId) as { id: string; user_id: string | null; [key: string]: unknown } | undefined;
  if (!brand) {
    return {
      error: NextResponse.json({ error: 'Brand not found' }, { status: 404 }),
      session,
      brand: null as null,
    };
  }

  if (brand.user_id && brand.user_id !== session.userId) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      session,
      brand: null as null,
    };
  }

  return { error: null, session, brand };
}

/**
 * Sanitize a string by stripping HTML tags to prevent stored XSS.
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize all string values in an object (shallow).
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeInput(result[key] as string);
    }
  }
  return result;
}

/**
 * Validate input length. Returns error message or null.
 */
export function validateLength(value: string, field: string, max: number): string | null {
  if (value.length > max) {
    return `${field} must be under ${max} characters`;
  }
  return null;
}
