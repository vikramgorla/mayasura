import { NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { createBlogPostSchema } from "@/lib/validation/blog";
import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { success, error, created } from "@/lib/api/response";
import { slugify } from "@/lib/utils/slug";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function generateUniquePostSlug(brandId: string, title: string): string {
  const base = slugify(title);
  if (!base) return `post-${Date.now()}`;

  let slug = base;
  let suffix = 2;

  while (true) {
    const existing = db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.brandId, brandId))
      .all()
      .find((p) => {
        const post = db
          .select({ slug: blogPosts.slug })
          .from(blogPosts)
          .where(eq(blogPosts.id, p.id))
          .get();
        return post?.slug === slug;
      });

    if (!existing) return slug;
    slug = `${base}-${suffix}`;
    suffix++;
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const list = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.brandId, id))
      .orderBy(desc(blogPosts.createdAt))
      .all()
      .map((p) => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
      }));

    return success(list);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List blog posts error:", err);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const body: unknown = await request.json();
    const parsed = createBlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { tags, ...data } = parsed.data;
    const postSlug = data.slug || generateUniquePostSlug(id, data.title);
    const now = new Date().toISOString();

    const post = {
      id: nanoid(),
      brandId: id,
      ...data,
      slug: postSlug,
      tags: tags ? JSON.stringify(tags) : null,
      publishedAt:
        data.status === "published" ? data.publishedAt || now : null,
      createdAt: now,
      updatedAt: now,
    };

    db.insert(blogPosts).values(post).run();

    return created({ ...post, tags: tags || [] });
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Create blog post error:", err);
    return error("Internal server error", 500);
  }
}
