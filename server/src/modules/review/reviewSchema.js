import {z} from "zod";

export const ReviewSchema = z.object({
	id: z.string().uuid(),
	order_id: z.string().uuid(),
	client_id: z.string().uuid(),
	provider_id: z.string().uuid(),
	rating: z.number().int().min(1).max(5),
	comment: z.string().optional(),
	created_at: z.date().default(() => new Date()),
});

export const CreateReviewSchema = ReviewSchema.omit({
	id: true,
	created_at: true,
});
export const UpdateReviewSchema = CreateReviewSchema.partial();
