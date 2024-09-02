import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.number().min(1, 'Quantity is required'),
  description: z.string().optional(),
  createdAt: z.date().default(new Date()).optional(),
});

export type TProduct = z.infer<typeof ProductSchema>;
