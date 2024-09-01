import { z } from 'zod';

export const navItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().min(1, 'Link is required'),
});

export type TNavItem = z.infer<typeof navItemSchema>;
