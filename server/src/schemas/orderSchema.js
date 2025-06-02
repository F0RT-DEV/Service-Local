import { z } from 'zod';

export const OrderSchema = z.object({
  id: z.string().uuid(),
  client_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  category_id: z.string().uuid().optional(),
  status: z.enum(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']).default('pending'),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  scheduled_date: z.date().optional(),
  created_at: z.date().default(() => new Date()),
});

export const CreateOrderSchema = OrderSchema.omit({ id: true, created_at: true });
export const UpdateOrderSchema = CreateOrderSchema.partial();
