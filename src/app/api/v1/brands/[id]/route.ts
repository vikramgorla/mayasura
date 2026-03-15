import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { requireBrandOwner, AuthError } from "@/lib/auth/guards";
import { updateBrandSchema } from "@/lib/validation/brand";
import { db } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";
import { success, error, noContent } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { brand } = await requireBrandOwner(id);

    return success({
      ...brand,
      channels: brand.channels ? JSON.parse(brand.channels) : [],
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("Get brand error:", err);
    return error("Internal server error", 500);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    const body: unknown = await request.json();
    const parsed = updateBrandSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { channels, ...data } = parsed.data;

    db.update(brands)
      .set({
        ...data,
        ...(channels !== undefined
          ? { channels: JSON.stringify(channels) }
          : {}),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(brands.id, id))
      .run();

    const updated = db
      .select()
      .from(brands)
      .where(eq(brands.id, id))
      .get();

    return success({
      ...updated,
      channels: updated?.channels ? JSON.parse(updated.channels) : [],
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("Update brand error:", err);
    return error("Internal server error", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await requireBrandOwner(id);

    db.delete(brands).where(eq(brands.id, id)).run();

    return noContent();
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("Delete brand error:", err);
    return error("Internal server error", 500);
  }
}
