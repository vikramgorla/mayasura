import { NextRequest, NextResponse } from 'next/server';
import { getPageViewStatsEnhanced, getOrdersByBrand, getBlogPosts, getContactSubmissions, getNewsletterSubscribers } from '@/lib/db';
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
    const pageViews = getPageViewStatsEnhanced(id, days);
    const orders = getOrdersByBrand(id) as Array<{ total: number; status: string; created_at: string }>;
    const blogPosts = getBlogPosts(id) as Array<{ status: string }>;
    const contacts = getContactSubmissions(id) as Array<{ status: string }>;
    const subscribers = getNewsletterSubscribers(id);

    const revenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    // Calculate previous period revenue for trend
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const prevCutoff = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000).toISOString();
    const currentOrders = orders.filter(o => o.created_at > cutoff && o.status !== 'cancelled');
    const prevOrders = orders.filter(o => o.created_at > prevCutoff && o.created_at <= cutoff && o.status !== 'cancelled');
    const currentRevenue = currentOrders.reduce((s, o) => s + o.total, 0);
    const prevRevenue = prevOrders.reduce((s, o) => s + o.total, 0);

    // Conversion rate: orders / page views
    const conversionRate = pageViews.total > 0 ? ((orders.length / pageViews.total) * 100) : 0;
    const prevConversionRate = pageViews.prevTotal > 0 ? ((prevOrders.length / pageViews.prevTotal) * 100) : 0;

    return NextResponse.json({
      pageViews: {
        total: pageViews.total,
        prevTotal: pageViews.prevTotal,
        byPage: pageViews.byPage,
        byDay: pageViews.byDay,
      },
      uniqueVisitors: pageViews.uniqueVisitors,
      prevUniqueVisitors: pageViews.prevUniqueVisitors,
      devices: pageViews.devices,
      referrers: pageViews.byReferrer,
      orderCount: orders.length,
      revenue,
      currentRevenue,
      prevRevenue,
      conversionRate: Math.round(conversionRate * 100) / 100,
      prevConversionRate: Math.round(prevConversionRate * 100) / 100,
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
