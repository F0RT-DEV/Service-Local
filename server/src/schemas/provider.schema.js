import { z } from "zod";

export const createUserSchema = z.object({
    bio: z.string().min(1, "Biografia é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    phone: z.string().optional(),
    role: z.enum(["client", "provider", "admin"]).optional(),
});
