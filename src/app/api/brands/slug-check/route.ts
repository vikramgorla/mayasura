import { NextRequest, NextResponse } from 'next/server';
import { sanitizeSlug, isSlugAvailable, isReservedSlug, generateUniqueSlug } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

/**
 * GET /api/brands/slug-check?name=My+Brand
 * 
 * Returns the slug that would be generated for a given brand name,
 * along with its availability status.
 */
export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const name = request.nextUrl.searchParams.get('name');
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
    }

    const baseSlug = sanitizeSlug(name);
    const isAvailable = baseSlug.length >= 2 && !isReservedSlug(baseSlug) && isSlugAvailable(baseSlug);
    const suggestedSlug = isAvailable ? baseSlug : generateUniqueSlug(name);

    return NextResponse.json({
      slug: baseSlug,
      available: isAvailable,
      suggested: suggestedSlug,
    });
  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json({ error: 'Failed to check slug' }, { status: 500 });
  }
}
