import { NextRequest } from "next/server";
import { eq, asc } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { testimonials } from "@/lib/db/schema";
import { success, error, created } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const list = db
      .select()
      .from(testimonials)
      .where(eq(testimonials.brandId, id))
      .orderBy(asc(testimonials.sortOrder))
      .all();

    return success(list);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List testimonials error:", err);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const body = await request.json();
    const { authorName, authorRole, authorCompany, quote, rating, featured } = body;

    if (!authorName || !quote) {
      return error("Author name and quote are required", 400);
    }

    const newId = crypto.randomUUID();

    // Get next sort order
    const maxOrder = db
      .select({ max: testimonials.sortOrder })
      .from(testimonials)
      .where(eq(testimonials.brandId, id))
      .all();

    const nextOrder = maxOrder.length > 0
      ? Math.max(...maxOrder.map((r) => r.max ?? 0)) + 1
      : 0;

    db.insert(testimonials)
      .values({
        id: newId,
        brandId: id,
        authorName,
        authorRole: authorRole || null,
        authorCompany: authorCompany || null,
        quote,
        rating: rating ? parseInt(String(rating), 10) : null,
        featured: featured || false,
        sortOrder: nextOrder,
      })
      .run();

    const inserted = db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, newId))
      .get();

    return created(inserted);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Create testimonial error:", err);
    return error("Internal server error", 500);
  }
}
