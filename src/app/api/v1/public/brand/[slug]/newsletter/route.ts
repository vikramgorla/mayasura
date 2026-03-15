import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { brands, newsletterSubscribers } from "@/lib/db/schema";
import { created, error } from "@/lib/api/response";

const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().max(200).optional(),
});

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const brand = db
      .select({ id: brands.id, status: brands.status })
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!brand || brand.status !== "launched") {
      return error("Brand not found", 404);
    }

    const body: unknown = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return error(messages, 400);
    }

    const { email, name } = parsed.data;

    // Upsert: if already subscribed, reactivate
    const existing = db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .get();

    if (existing) {
      db.update(newsletterSubscribers)
        .set({
          status: "active",
          name: name || existing.name,
          subscribedAt: new Date().toISOString(),
        })
        .where(eq(newsletterSubscribers.id, existing.id))
        .run();
    } else {
      db.insert(newsletterSubscribers)
        .values({
          id: nanoid(),
          brandId: brand.id,
          email,
          name: name || null,
        })
        .run();
    }

    return created({ success: true });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    return error("Internal server error", 500);
  }
}
