import { z } from 'zod';

export const OrderSchema = z.object({
  id: z.string().uuid(),
  client_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  service_id: z.string().uuid(),
  status: z.enum(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']).default('pending'),
  scheduled_date: z.coerce.date().optional(), // usa z.coerce.date para converter string para Date automaticamente
  created_at: z.date().default(() => new Date()),
});

export const CreateOrderSchema = OrderSchema.omit({ id: true, created_at: true });
export const UpdateOrderSchema = CreateOrderSchema.partial();
