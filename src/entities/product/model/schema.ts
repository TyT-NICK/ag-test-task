import { z } from "zod";

export const productBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  discountPercentage: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  stock: z.number().int().min(0).optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
});
