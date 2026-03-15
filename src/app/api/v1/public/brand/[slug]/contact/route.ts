import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { brands, contactSubmissions, tickets, ticketMessages } from "@/lib/db/schema";
import { created, error } from "@/lib/api/response";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  subject: z.string().max(500).optional(),
  message: z.string().min(1, "Message is required").max(5000),
});

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const brand = db
      .select({ id: brands.id, status: brands.status })
      .from(brands)
      .where(eq(brands.slug, slug))
      .get();

    if (!brand || brand.status !== "launched") {
      return error("Brand not found", 404);
    }

    const body: unknown = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      return error(messages, 400);
    }

    const { name, email, subject, message: msg } = parsed.data;

    const submissionId = nanoid();
    db.insert(contactSubmissions)
      .values({
        id: submissionId,
        brandId: brand.id,
        name,
        email,
        subject: subject || null,
        message: msg,
      })
      .run();

    // Auto-create support ticket from contact form submission
    const ticketId = nanoid();
    const ticketSubject = subject || `Contact form: ${name}`;

    db.insert(tickets)
      .values({
        id: ticketId,
        brandId: brand.id,
        customerName: name,
        customerEmail: email,
        subject: ticketSubject,
        priority: "medium",
        status: "open",
      })
      .run();

    db.insert(ticketMessages)
      .values({
        id: nanoid(),
        ticketId,
        role: "customer",
        content: msg,
      })
      .run();

    return created({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return error("Internal server error", 500);
  }
}
