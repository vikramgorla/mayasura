import { NextRequest, NextResponse } from 'next/server';
import {
  getProductsByBrand,
  getBlogPosts,
  getTestimonialCount,
  getActiveSubscriberCount,
  getChatbotFaqs,
  getBrandSettings,
  getContentByBrand,
  getPageViewStats,
} from '@/lib/db';
import { requireBrandOwner } from '@/lib/api-auth';

interface BrandRow {
  id: string;
  description: string | null;
  website_template: string | null;
  primary_color: string;
  [key: string]: unknown;
}

interface ScoreItem {
  key: string;
  label: string;
  description: string;
  points: number;
  earned: boolean;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, brand: rawBrand } = await requireBrandOwner(id);
    if (error) return error;
    const brand = rawBrand as unknown as BrandRow;

    const products = getProductsByBrand(id);
    const blogPosts = getBlogPosts(id);
    const testimonialCount = getTestimonialCount(id);
    const subscriberCount = getActiveSubscriberCount(id);
    const faqs = getChatbotFaqs(id);
    const settings = getBrandSettings(id);
    const content = getContentByBrand(id);
    const pageViews = getPageViewStats(id, 30);

    const items: ScoreItem[] = [
      {
        key: 'products',
        label: 'Has products',
        description: 'Add at least one product to your catalog',
        points: 10,
        earned: products.length > 0,
      },
      {
        key: 'blog',
        label: 'Has blog posts',
        description: 'Publish blog content to boost SEO',
        points: 10,
        earned: blogPosts.length > 0,
      },
      {
        key: 'description',
        label: 'Has description',
        description: 'Write a compelling brand description',
        points: 10,
        earned: !!brand.description && brand.description.length > 20,
      },
      {
        key: 'testimonials',
        label: 'Has testimonials',
        description: 'Add customer testimonials for social proof',
        points: 10,
        earned: testimonialCount > 0,
      },
      {
        key: 'subscribers',
        label: 'Has newsletter subscribers',
        description: 'Grow your email list',
        points: 10,
        earned: subscriberCount > 0,
      },
      {
        key: 'chatbot',
        label: 'Has chatbot configured',
        description: 'Set up FAQ answers for your AI chatbot',
        points: 10,
        earned: faqs.length > 0,
      },
      {
        key: 'design',
        label: 'Has design customized',
        description: 'Choose a template and customize colors',
        points: 10,
        earned: brand.website_template !== 'minimal' || brand.primary_color !== '#0f172a',
      },
      {
        key: 'social',
        label: 'Has social content',
        description: 'Generate social media content',
        points: 10,
        earned: (content as Array<{ type: string }>).some(c => c.type === 'social'),
      },
      {
        key: 'seo',
        label: 'Has SEO configured',
        description: 'Set up SEO meta tags and descriptions',
        points: 10,
        earned: !!settings['seo_title'] || !!settings['seo_description'],
      },
      {
        key: 'analytics',
        label: 'Has analytics data',
        description: 'Get visitors to your site',
        points: 10,
        earned: pageViews.total > 0,
      },
    ];

    const score = items.filter(i => i.earned).reduce((sum, i) => sum + i.points, 0);

    return NextResponse.json({
      score,
      maxScore: 100,
      items,
      completedCount: items.filter(i => i.earned).length,
      totalCount: items.length,
    });
  } catch (err) {
    console.error('Error calculating brand score:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
