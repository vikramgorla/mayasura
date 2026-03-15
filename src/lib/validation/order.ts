import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters")
    .trim(),
  customerEmail: z.string().email("Invalid email address").max(255),
  customerPhone: z.string().max(50).optional(),
  shippingAddress: z
    .string()
    .min(1, "Shipping address is required")
    .max(1000)
    .trim(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  discountCode: z.string().max(50).optional(),
  currency: z.string().length(3).default("USD"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
