import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { signupSchema } from "@/lib/validation/auth";
import { hashPassword } from "@/lib/auth/password";
import { createToken } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { success, error, created } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return error(
        parsed.error.issues.map((i) => i.message).join(", "),
        400
      );
    }

    const { email, password, name } = parsed.data;

    // Check if email already exists
    const existing = db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (existing) {
      return error("Email already registered", 409);
    }

    const id = nanoid();
    const passwordHash = await hashPassword(password);

    db.insert(users)
      .values({
        id,
        email,
        name,
        passwordHash,
        tokenVersion: 0,
      })
      .run();

    const token = await createToken({ userId: id, email, tokenVersion: 0 });

    const response = created({
      user: { id, email, name },
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
    console.error("Signup error:", err);
    return error("Internal server error", 500);
  }
}
