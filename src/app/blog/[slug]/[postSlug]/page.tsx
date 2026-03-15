import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands, blogPosts } from "@/lib/db/schema";
import { getTemplate } from "@/lib/templates/website-templates";
import { BlogPostClient } from "./blog-post-client";

interface PageProps {
  params: Promise<{ slug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, postSlug } = await params;
  const brand = db.select().from(brands).where(eq(brands.slug, slug)).get();
  if (!brand) return {};

  const post = db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.brandId, brand.id),
        eq(blogPosts.slug, postSlug),
        eq(blogPosts.status, "published")
      )
    )
    .get();

  if (!post) return {};

  return {
    title: post.seoTitle || `${post.title} — ${brand.name}`,
    description:
      post.seoDescription || post.excerpt || `Read ${post.title} on ${brand.name}`,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, postSlug } = await params;
  const brand = db.select().from(brands).where(eq(brands.slug, slug)).get();

  if (!brand || brand.status !== "launched") notFound();

  const post = db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.brandId, brand.id),
        eq(blogPosts.slug, postSlug),
        eq(blogPosts.status, "published")
      )
    )
    .get();

  if (!post) notFound();

  const templateId = brand.websiteTemplate || "minimal";
  const template = getTemplate(templateId);
  if (!template) notFound();

  const accentColor = brand.accentColor || template.colors.light.accent;

  return (
    <BlogPostClient
      slug={slug}
      brandName={brand.name}
      post={{
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags ? JSON.parse(post.tags) : [],
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
      }}
      accentColor={accentColor}
    />
  );
}
