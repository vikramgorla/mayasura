import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return error("Not authenticated", 401);
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return error("Invalid or expired token", 401);
    }

    const user = db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .get();

    if (!user) {
      return error("User not found", 401);
    }

    return success({ user });
  } catch (err) {
    console.error("Auth me error:", err);
    return error("Internal server error", 500);
  }
}
