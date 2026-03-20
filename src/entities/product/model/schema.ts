import { z } from "zod";

export const productBodySchema = z.object({
  title: z.string().min(1, "required"),
  description: z.string().optional(),
  price: z.coerce.number({ error: "invalidNumber" }).positive("positive"),
  discountPercentage: z.coerce
    .number({ error: "invalidNumber" })
    .min(0, "minValue")
    .max(100, "maxValue")
    .optional(),
  rating: z.coerce
    .number({ error: "invalidNumber" })
    .min(0, "minValue")
    .max(5, "maxValue")
    .optional(),
  stock: z.coerce
    .number({ error: "invalidNumber" })
    .int("integer")
    .min(0, "minValue")
    .optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
});
