import { NextRequest, NextResponse } from 'next/server';
import { getPageViewStats, getOrdersByBrand, getBlogPosts, getContactSubmissions, getNewsletterSubscribers } from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await requireBrandOwner(id);
    if (error) return error;

    const days = parseInt(request.nextUrl.searchParams.get('days') || '30');
    const pageViews = getPageViewStats(id, days);
    const orders = getOrdersByBrand(id) as Array<{ total: number; status: string; created_at: string }>;
    const blogPosts = getBlogPosts(id) as Array<{ status: string }>;
    const contacts = getContactSubmissions(id) as Array<{ status: string }>;
    const subscribers = getNewsletterSubscribers(id);

    const revenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({
      pageViews,
      orderCount: orders.length,
      revenue,
      blogPostCount: blogPosts.length,
      publishedPostCount: blogPosts.filter(p => p.status === 'published').length,
      contactCount: contacts.length,
      newContactCount: contacts.filter(c => c.status === 'new').length,
      subscriberCount: (subscribers as Array<unknown>).length,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
