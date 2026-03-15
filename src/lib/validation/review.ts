import { z } from "zod";

export const createReviewSchema = z.object({
  authorName: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters")
    .trim(),
  authorEmail: z.string().email("Invalid email address").max(255),
  rating: z.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
  title: z.string().max(200).optional(),
  body: z.string().max(5000).optional(),
});

export const updateReviewStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewStatusInput = z.infer<typeof updateReviewStatusSchema>;
