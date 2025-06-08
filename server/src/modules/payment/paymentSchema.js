import { z } from 'zod';

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  payment_method: z.string().optional(),
  transaction_id: z.string().max(100).optional(),
  status: z.enum(['pending', 'paid', 'failed']).default('pending'),
  paid_at: z.date().optional(),
});

export const CreatePaymentSchema = PaymentSchema.omit({ id: true });
export const UpdatePaymentSchema = CreatePaymentSchema.partial();
    