import { NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import {
  brands,
  products,
  blogPosts,
  testimonials,
  newsletterSubscribers,
  chatbotFaqs,
  brandSettings,
  pageViews,
  content,
} from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface ScoreItem {
  key: string;
  label: string;
  completed: boolean;
  points: number;
  href: string;
}

function countRows(
  table: Parameters<typeof db.select>[0] extends undefined ? never : never,
  ...args: unknown[]
): number {
  // This is a helper — but we'll just inline the queries
  return 0;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { brand } = await requireBrandOwner(id);

    // Count various entities
    const productCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(eq(products.brandId, id))
      .get()?.count ?? 0;

    const blogCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(blogPosts)
      .where(eq(blogPosts.brandId, id))
      .get()?.count ?? 0;

    const testimonialCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(testimonials)
      .where(eq(testimonials.brandId, id))
      .get()?.count ?? 0;

    const subscriberCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.brandId, id))
      .get()?.count ?? 0;

    const faqCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(chatbotFaqs)
      .where(eq(chatbotFaqs.brandId, id))
      .get()?.count ?? 0;

    const pageViewCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(pageViews)
      .where(eq(pageViews.brandId, id))
      .get()?.count ?? 0;

    const socialContentCount = db
      .select({ count: sql<number>`COUNT(*)` })
      .from(content)
      .where(eq(content.brandId, id))
      .get()?.count ?? 0;

    // Check design customization
    const hasCustomDesign =
      (brand.websiteTemplate && brand.websiteTemplate !== "minimal") ||
      (brand.accentColor && brand.accentColor !== "#5B21B6");

    const items: ScoreItem[] = [
      {
        key: "name",
        label: "Brand name set",
        completed: !!brand.name && brand.name.length > 0,
        points: 10,
        href: "/settings",
      },
      {
        key: "description",
        label: "Description added (20+ chars)",
        completed: !!brand.description && brand.description.length > 20,
        points: 10,
        href: "/settings",
      },
      {
        key: "products",
        label: "Products added",
        completed: productCount > 0,
        points: 10,
        href: "/products",
      },
      {
        key: "blog",
        label: "Blog posts published",
        completed: blogCount > 0,
        points: 10,
        href: "/blog",
      },
      {
        key: "testimonials",
        label: "Testimonials added",
        completed: testimonialCount > 0,
        points: 10,
        href: "/testimonials",
      },
      {
        key: "subscribers",
        label: "Newsletter subscribers",
        completed: subscriberCount > 0,
        points: 10,
        href: "/subscribers",
      },
      {
        key: "chatbot",
        label: "Chatbot FAQs configured",
        completed: faqCount > 0,
        points: 10,
        href: "/chatbot",
      },
      {
        key: "design",
        label: "Design customized",
        completed: !!hasCustomDesign,
        points: 10,
        href: "/design",
      },
      {
        key: "social",
        label: "Social content created",
        completed: socialContentCount > 0,
        points: 10,
        href: "/social",
      },
      {
        key: "pageviews",
        label: "Site has visitors",
        completed: pageViewCount > 0,
        points: 10,
        href: "/analytics",
      },
    ];

    const completedCount = items.filter((i) => i.completed).length;
    const score = items.reduce(
      (sum, item) => sum + (item.completed ? item.points : 0),
      0
    );

    return success({
      score,
      maxScore: 100,
      items,
      completedCount,
      totalCount: items.length,
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Brand score error:", err);
    return error("Internal server error", 500);
  }
}
