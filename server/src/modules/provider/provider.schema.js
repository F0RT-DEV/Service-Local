import {z} from "zod";

export const ProviderSchema = z.object({
	id: z.string().uuid(),
	user_id: z.string().uuid(),
	bio: z.string().optional(),
	status: z.enum(["pending", "approved", "rejected"]).default("pending"),
	availability: z.string().optional(),
	cnpj: z.string().max(18).optional(),
});

export const CreateProviderSchema = ProviderSchema.omit({id: true});
export const UpdateProviderSchema = CreateProviderSchema.partial();

export const ProviderCategorySchema = z.object({
	provider_id: z.string().uuid(),
	category_id: z.string().uuid(),
});
