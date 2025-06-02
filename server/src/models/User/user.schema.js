import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    cpf: z.string().optional(),
    phone: z.string().optional(),
    cep: z.string().optional(),
    logradouro: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    localidade: z.string().optional(),
    uf: z.string().length(2).optional(),
    numero: z.string().optional(),

  role: z.enum(['client', 'provider', 'admin']).optional()

});
