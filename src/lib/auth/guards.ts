import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { verifyToken, type TokenPayload } from "./jwt";
import { db } from "@/lib/db/client";
import { users, brands } from "@/lib/db/schema";

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAuth(): Promise<TokenPayload & { user: typeof users.$inferSelect }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new AuthError("Authentication required", 401);
  }

  let payload: TokenPayload;
  try {
    payload = await verifyToken(token);
  } catch {
    throw new AuthError("Invalid or expired token", 401);
  }

  const user = db.select().from(users).where(eq(users.id, payload.userId)).get();

  if (!user) {
    throw new AuthError("User not found", 401);
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    throw new AuthError("Token has been revoked", 401);
  }

  return { ...payload, user };
}

export async function requireBrandOwner(brandId: string) {
  const auth = await requireAuth();

  const brand = db
    .select()
    .from(brands)
    .where(eq(brands.id, brandId))
    .get();

  if (!brand) {
    throw new AuthError("Brand not found", 404);
  }

  if (brand.userId !== auth.user.id) {
    throw new AuthError("Not authorized to access this brand", 403);
  }

  return { ...auth, brand };
}
