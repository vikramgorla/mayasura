import { z } from "zod";
import { slugSchema } from "./common";

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(1, "Brand name is required")
    .max(100, "Brand name must be at most 100 characters")
    .trim(),
  slug: slugSchema,
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  industry: z.string().max(100).optional(),
  primaryColor: z.string().max(7).optional(),
  secondaryColor: z.string().max(7).optional(),
  accentColor: z.string().max(7).optional(),
  fontHeading: z.string().max(100).optional(),
  fontBody: z.string().max(100).optional(),
  brandVoice: z.string().max(500).optional(),
  channels: z.array(z.string()).optional(),
  websiteTemplate: z.string().max(50).optional(),
});

export const updateBrandSchema = createBrandSchema.partial().omit({ slug: true });

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
