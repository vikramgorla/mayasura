import { NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { createDiscountSchema } from "@/lib/validation/discount";
import { db } from "@/lib/db/client";
import { discountCodes } from "@/lib/db/schema";
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
      .from(discountCodes)
      .where(eq(discountCodes.brandId, id))
      .orderBy(desc(discountCodes.createdAt))
      .all();

    return success(list);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("List discounts error:", err);
    return error("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const body: unknown = await request.json();
    const parsed = createDiscountSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const discount = {
      id: nanoid(),
      brandId: id,
      ...parsed.data,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };

    db.insert(discountCodes).values(discount).run();

    return created(discount);
  } catch (err) {
    if (err instanceof AuthError) return error(err.message, err.status);
    console.error("Create discount error:", err);
    return error("Internal server error", 500);
  }
}
