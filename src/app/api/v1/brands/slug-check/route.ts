import { NextRequest } from "next/server";
import { requireAuth, AuthError } from "@/lib/auth/guards";
import { checkSlugAvailability } from "@/lib/utils/slug";
import { success, error } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const name = request.nextUrl.searchParams.get("name");

    if (!name) {
      return error("Name parameter is required", 400);
    }

    const result = checkSlugAvailability(name);

    return success(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return error(err.message, err.status);
    }
    console.error("Slug check error:", err);
    return error("Internal server error", 500);
  }
}
