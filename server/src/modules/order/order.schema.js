import { z } from "zod";

const AddressSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  logradouro: z.string().max(100).nonempty("Logradouro obrigatório"),
  complemento: z.string().max(50).optional(),
  bairro: z.string().max(50).nonempty("Bairro obrigatório"),
  cidade: z.string().max(50).nonempty("Cidade obrigatória"),
  uf: z.string().length(2, "UF deve ter 2 caracteres").regex(/^[A-Z]{2}$/, "UF deve ser sigla de estado")
});

export const CreateOrderSchema = z.object({
  service_id: z.string().uuid("ID do serviço inválido"),
  scheduled_date: z.coerce.date()
    .min(new Date(), "Data agendada não pode ser no passado")
    .optional(),
  notes: z.string().max(500).optional(),
  address: AddressSchema,
  phone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone deve estar no formato (11) 99999-9999")
    .nonempty("Telefone é obrigatório")
});

export const RateOrderSchema = z.object({
  rating: z.number().int().min(1).max(5, "Avaliação deve ser entre 1 e 5"),
  comment: z.string().max(500).optional()
});

export const CancelOrderSchema = z.object({
  cancel_reason: z.string().min(10, "Motivo deve ter pelo menos 10 caracteres").max(500)
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'])
});