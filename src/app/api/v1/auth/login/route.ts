import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/validation/auth";
import { verifyPassword } from "@/lib/auth/password";
import { createToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { success, error } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { email, password } = parsed.data;

    const user = db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (!user) {
      return error("Invalid email or password", 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return error("Invalid email or password", 401);
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
    });

    const response = success({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return error("Internal server error", 500);
  }
}
