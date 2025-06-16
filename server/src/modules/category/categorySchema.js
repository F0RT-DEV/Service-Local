import {z} from "zod";

export const CategorySchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100),
});

export const CreateCategorySchema = CategorySchema.omit({id: true});
export const UpdateCategorySchema = CreateCategorySchema.partial();
