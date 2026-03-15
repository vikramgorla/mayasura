import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import {
  brands,
  products,
  blogPosts,
  testimonials,
  brandSettings,
  chatbotFaqs,
  newsletterSubscribers,
} from "@/lib/db/schema";
import { error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { brand } = await requireBrandOwner(id);

    const productList = db
      .select()
      .from(products)
      .where(eq(products.brandId, id))
      .all();

    const blogList = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.brandId, id))
      .all();

    const testimonialList = db
      .select()
      .from(testimonials)
      .where(eq(testimonials.brandId, id))
      .all();

    const settingsList = db
      .select()
      .from(brandSettings)
      .where(eq(brandSettings.brandId, id))
      .all();

    const faqList = db
      .select()
      .from(chatbotFaqs)
      .where(eq(chatbotFaqs.brandId, id))
      .all();

    const subscriberList = db
      .select({
        email: newsletterSubscribers.email,
        name: newsletterSubscribers.name,
        status: newsletterSubscribers.status,
        subscribedAt: newsletterSubscribers.subscribedAt,
      })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.brandId, id))
      .all();

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      brand: {
        ...brand,
        channels: brand.channels ? JSON.parse(brand.channels) : [],
      },
      products: productList,
      blogPosts: blogList,
      testimonials: testimonialList,
      settings: settingsList,
      chatbotFaqs: faqList,
      subscribers: subscriberList,
    };

    const json = JSON.stringify(exportData, null, 2);
    const filename = `${brand.slug}-export-${new Date().toISOString().split("T")[0]}.json`;

    return new Response(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Export brand error:", err);
    return error("Internal server error", 500);
  }
}
