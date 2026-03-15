import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be at most 300 characters")
    .trim(),
  slug: z.string().max(300).optional(),
  content: z.string().max(100000).optional(),
  excerpt: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  publishedAt: z.string().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogWriterSchema = z.object({
  brandId: z.string().min(1, "Brand ID is required"),
  topic: z.string().min(1).max(500),
  step: z.enum(["outline", "article", "improve", "seo"]),
  content: z.string().max(100000).optional(),
  outline: z.string().max(10000).optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogWriterInput = z.infer<typeof blogWriterSchema>;
