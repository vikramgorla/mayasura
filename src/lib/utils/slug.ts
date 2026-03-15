import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "dashboard",
  "create",
  "login",
  "signup",
  "site",
  "shop",
  "blog",
  "chat",
  "templates",
  "public",
]);

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

export function generateUniqueSlug(name: string): string {
  const base = slugify(name);
  if (!base) return `brand-${Date.now()}`;

  if (isReservedSlug(base)) {
    return findAvailableSlug(`${base}-brand`);
  }

  return findAvailableSlug(base);
}

function findAvailableSlug(base: string): string {
  let slug = base;
  let suffix = 2;

  while (true) {
    const existing = db
      .select({ id: brands.id })
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!existing) return slug;

    slug = `${base}-${suffix}`;
    suffix++;
  }
}

export function checkSlugAvailability(name: string): {
  slug: string;
  available: boolean;
  suggested: string;
} {
  const slug = slugify(name);
  if (!slug) {
    return { slug: "", available: false, suggested: "" };
  }

  if (isReservedSlug(slug)) {
    const suggested = generateUniqueSlug(name);
    return { slug, available: false, suggested };
  }

  const existing = db
    .select({ id: brands.id })
    .from(brands)
    .where(eq(brands.slug, slug))
    .get();

  if (existing) {
    const suggested = generateUniqueSlug(name);
    return { slug, available: false, suggested };
  }

  return { slug, available: true, suggested: slug };
}
