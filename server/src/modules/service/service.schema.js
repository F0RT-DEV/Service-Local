import {z} from "zod";

export const serviceSchema = z.object({
	category_id: z.string(),
	title: z.string().min(3),
	description: z.string().min(10),
	price_min: z.number().nonnegative(),
	price_max: z.number().nonnegative(),
	images: z.string(), // ou z.array(z.string()) se quiser JSON
	is_active: z.boolean().optional().default(true),
});
