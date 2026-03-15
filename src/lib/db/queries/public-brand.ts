import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  brands,
  products,
  blogPosts,
  testimonials,
} from "@/lib/db/schema";

export interface PublicBrandData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  industry: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontHeading: string | null;
  fontBody: string | null;
  websiteTemplate: string | null;
  customCss: string | null;
  status: string;
  products: PublicProduct[];
  blogPosts: PublicBlogPost[];
  testimonials: PublicTestimonial[];
}

export interface PublicProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  imageUrl: string | null;
  category: string | null;
}

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  publishedAt: string | null;
}

export interface PublicTestimonial {
  id: string;
  authorName: string;
  authorRole: string | null;
  authorCompany: string | null;
  quote: string;
  rating: number | null;
  avatarUrl: string | null;
}

/**
 * Fetch a brand by slug with related public data.
 * Returns null if slug doesn't exist or brand is not launched.
 */
export function getPublicBrandBySlug(slug: string): PublicBrandData | null {
  const brand = db
    .select()
    .from(brands)
    .where(eq(brands.slug, slug))
    .get();

  if (!brand || brand.status !== "launched") {
    return null;
  }

  const brandProducts = db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      currency: products.currency,
      imageUrl: products.imageUrl,
      category: products.category,
    })
    .from(products)
    .where(
      and(eq(products.brandId, brand.id), eq(products.status, "active"))
    )
    .orderBy(products.sortOrder)
    .all();

  const brandBlogPosts = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      category: blogPosts.category,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.brandId, brand.id),
        eq(blogPosts.status, "published")
      )
    )
    .orderBy(desc(blogPosts.publishedAt))
    .all();

  const brandTestimonials = db
    .select({
      id: testimonials.id,
      authorName: testimonials.authorName,
      authorRole: testimonials.authorRole,
      authorCompany: testimonials.authorCompany,
      quote: testimonials.quote,
      rating: testimonials.rating,
      avatarUrl: testimonials.avatarUrl,
    })
    .from(testimonials)
    .where(eq(testimonials.brandId, brand.id))
    .orderBy(testimonials.sortOrder)
    .all();

  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    tagline: brand.tagline,
    description: brand.description,
    industry: brand.industry,
    logoUrl: brand.logoUrl,
    primaryColor: brand.primaryColor,
    secondaryColor: brand.secondaryColor,
    accentColor: brand.accentColor,
    fontHeading: brand.fontHeading,
    fontBody: brand.fontBody,
    websiteTemplate: brand.websiteTemplate,
    customCss: brand.customCss,
    status: brand.status,
    products: brandProducts,
    blogPosts: brandBlogPosts,
    testimonials: brandTestimonials,
  };
}
