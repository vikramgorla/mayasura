import { notFound } from "next/navigation";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { getTemplate } from "@/lib/templates/website-templates";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { BlogListingClient } from "./blog-listing-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `Blog — ${brand.name}`,
    description: `Read the latest from ${brand.name}`,
  };
}

interface BlogPostForListing {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export default async function BlogListingPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getPublicBrandBySlug(slug);

  if (!brand) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  // Fetch published posts with content for reading time
  const posts: BlogPostForListing[] = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      category: blogPosts.category,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
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

  return (
    <BlogListingClient
      slug={slug}
      brandName={brand.name}
      posts={posts}
      accentColor={accentColor}
    />
  );
}
