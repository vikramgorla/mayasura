import { NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { createProductSchema } from "@/lib/validation/product";
import { db } from "@/lib/db/client";
import { products } from "@/lib/db/schema";
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
      .from(products)
      .where(eq(products.brandId, id))
      .orderBy(products.sortOrder, desc(products.createdAt))
      .all();

    return success(list);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List products error:", err);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const body: unknown = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const product = {
      id: nanoid(),
      brandId: id,
      ...parsed.data,
      createdAt: new Date().toISOString(),
    };

    db.insert(products).values(product).run();

    return created(product);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Create product error:", err);
    return error("Internal server error", 500);
  }
}
