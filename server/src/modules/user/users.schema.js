import {z} from "zod";

export const UserSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(150),
    password: z.string().min(6).max(255),
    phone: z.string().max(20).optional(),
    role: z.enum(["client", "provider", "admin"]).default("client"),
    cpf: z.string().max(14).optional(), 
    cep: z.string().max(10).optional(),
    logradouro: z.string().max(255).optional(),
    complemento: z.string().max(255).optional(),
    bairro: z.string().max(100).optional(),
    localidade: z.string().max(100).optional(),
    uf: z.string().length(2).optional(),
    numero: z.string().max(10).optional(),
});

export const CreateUserSchema = UserSchema.omit({
	id: true,
	created_at: true,
	updated_at: true,
});
export const UpdateUserSchema = CreateUserSchema.partial();
