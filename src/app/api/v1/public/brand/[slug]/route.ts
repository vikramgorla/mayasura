import { NextRequest } from "next/server";
import { getPublicBrandBySlug } from "@/lib/db/queries/public-brand";
import { success, error } from "@/lib/api/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug || slug.length > 100) {
      return error("Invalid slug", 400);
    }

    const brand = getPublicBrandBySlug(slug);

    if (!brand) {
      return error("Brand not found", 404);
    }

    return success(brand);
  } catch (err) {
    console.error("Public brand GET error:", err);
    return error("Internal server error", 500);
  }
}
