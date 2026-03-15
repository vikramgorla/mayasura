import { z } from "zod";

export const slugSchema = z
  .string()
  .min(2)
  .max(63)
  .regex(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
    "Slug must start and end with a letter or number, and contain only lowercase letters, numbers, and hyphens"
  );

export const emailSchema = z.string().email("Invalid email address").max(255);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
