import { z } from "zod";

export const createUserSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	email: z.string().email("Email inválido"),
	password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
	phone: z.string().optional(),
	role: z.enum(["client", "provider", "admin"]).optional(),
});
