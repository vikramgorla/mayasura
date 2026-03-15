import { z } from "zod";

export const createDiscountSchema = z.object({
  code: z
    .string()
    .min(1, "Discount code is required")
    .max(50, "Code must be at most 50 characters")
    .trim()
    .transform((val) => val.toUpperCase()),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0.01, "Value must be positive"),
  minOrder: z.number().min(0).optional(),
  maxUses: z.number().int().min(1).optional(),
  active: z.boolean().default(true),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const updateDiscountSchema = createDiscountSchema.partial();

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
export type UpdateDiscountInput = z.infer<typeof updateDiscountSchema>;
