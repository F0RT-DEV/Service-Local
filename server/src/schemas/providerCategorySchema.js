import { z } from 'zod';

export const ProviderCategorySchema = z.object({
  provider_id: z.string().uuid(),
  category_id: z.string().uuid(),
});
