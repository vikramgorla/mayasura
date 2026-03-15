import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must be at most 200 characters")
    .trim(),
  description: z.string().max(5000).optional(),
  price: z.number().min(0, "Price must be non-negative"),
  currency: z.string().length(3).default("USD"),
  imageUrl: z.string().url().optional(),
  category: z.string().max(100).optional(),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  stockCount: z.number().int().min(0).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
