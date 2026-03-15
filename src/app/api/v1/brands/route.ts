import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthError } from "@/lib/auth/guards";
import { createBrandSchema } from "@/lib/validation/brand";
import { generateUniqueSlug } from "@/lib/utils/slug";
import { db } from "@/lib/db/client";
import { brands, products } from "@/lib/db/schema";
import { success, error, created } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    const body: unknown = await request.json();
    const parsed = createBrandSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { products: productList, toneKeywords, channels, ...brandData } =
      parsed.data;

    const slug = generateUniqueSlug(brandData.name);
    const brandId = nanoid();

    const brand = {
      id: brandId,
      ...brandData,
      slug,
      channels: channels ? JSON.stringify(channels) : null,
      brandVoice: brandData.brandVoice
        ? `${brandData.brandVoice}${toneKeywords?.length ? `\n\nTone: ${toneKeywords.join(", ")}` : ""}`
        : toneKeywords?.length
          ? `Tone: ${toneKeywords.join(", ")}`
          : undefined,
      status: "active" as const,
      userId: auth.user.id,
    };

    db.insert(brands).values(brand).run();

    // Create products if provided
    if (productList && productList.length > 0) {
      const productValues = productList.map((p, index) => ({
        id: nanoid(),
        brandId,
        name: p.name,
        description: p.description,
        price: p.price ?? 0,
        currency: p.currency,
        category: p.category,
        sortOrder: index,
        status: "active" as const,
      }));

      for (const pv of productValues) {
        db.insert(products).values(pv).run();
      }
    }

    const createdBrand = db
      .select()
      .from(brands)
      .where(eq(brands.id, brandId))
      .get();

    return created(createdBrand);
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("Create brand error:", err);
    return error("Internal server error", 500);
  }
}

export async function GET() {
  try {
    const auth = await requireAuth();

    const userBrands = db
      .select()
      .from(brands)
      .where(eq(brands.userId, auth.user.id))
      .orderBy(desc(brands.createdAt))
      .all();

    // Parse channels JSON for each brand
    const parsed = userBrands.map((b) => ({
      ...b,
      channels: b.channels ? JSON.parse(b.channels) : [],
    }));

    return success(parsed);
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("List brands error:", err);
    return error("Internal server error", 500);
  }
}
