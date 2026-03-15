import { z } from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(1, "Brand name is required")
    .max(100, "Brand name must be at most 100 characters")
    .trim(),
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  industry: z.string().max(100).optional(),
  primaryColor: z.string().max(7).optional(),
  secondaryColor: z.string().max(7).optional(),
  accentColor: z.string().max(7).optional(),
  fontHeading: z.string().max(100).optional(),
  fontBody: z.string().max(100).optional(),
  brandVoice: z.string().max(2000).optional(),
  toneKeywords: z.array(z.string()).optional(),
  channels: z.array(z.string()).optional(),
  websiteTemplate: z.string().max(50).optional(),
  products: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().max(5000).optional(),
        price: z.number().min(0).optional(),
        currency: z.string().length(3).default("USD"),
        category: z.string().max(100).optional(),
      })
    )
    .optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
