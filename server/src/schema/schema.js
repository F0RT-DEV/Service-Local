import { z } from 'zod';

// User Schema
const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(150),
  password: z.string().min(6).max(255),
  phone: z.string().max(20).optional(),
  role: z.enum(['client', 'provider', 'admin']).default('client'),
  cep: z.string().max(10).optional(),
  logradouro: z.string().max(255).optional(),
  complemento: z.string().max(255).optional(),
  bairro: z.string().max(100).optional(),
  localidade: z.string().max(100).optional(),
  uf: z.string().length(2).optional(),
  numero: z.string().max(10).optional(),
});

// Provider Schema
const ProviderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  bio: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  availability: z.string().optional(),
  cnpj: z.string().max(18).optional(),
});

// Category Schema
const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
});

// Provider-Category Junction Schema
const ProviderCategorySchema = z.object({
  provider_id: z.string().uuid(),
  category_id: z.string().uuid(),
});

// Order Schema
const OrderSchema = z.object({
  id: z.string().uuid(),
  client_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  category_id: z.string().uuid().optional(),
  status: z.enum(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']).default('pending'),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  scheduled_date: z.date().optional(),
  created_at: z.date().default(() => new Date()),
});

// Payment Schema
const PaymentSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  payment_method: z.string().optional(),
  transaction_id: z.string().max(100).optional(),
  status: z.enum(['pending', 'paid', 'failed']).default('pending'),
  paid_at: z.date().optional(),
});

// Review Schema
const ReviewSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  client_id: z.string().uuid(),
  provider_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  created_at: z.date().default(() => new Date()),
});

// Create input schemas (without auto-generated fields)
const CreateUserSchema = UserSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

const CreateProviderSchema = ProviderSchema.omit({ id: true });
const CreateCategorySchema = CategorySchema.omit({ id: true });
const CreateOrderSchema = OrderSchema.omit({ id: true, created_at: true });
const CreatePaymentSchema = PaymentSchema.omit({ id: true });
const CreateReviewSchema = ReviewSchema.omit({ id: true, created_at: true });

// Update input schemas (make fields optional)
const UpdateUserSchema = CreateUserSchema.partial();
const UpdateProviderSchema = CreateProviderSchema.partial();
const UpdateCategorySchema = CreateCategorySchema.partial();
const UpdateOrderSchema = CreateOrderSchema.partial();
const UpdatePaymentSchema = CreatePaymentSchema.partial();
const UpdateReviewSchema = CreateReviewSchema.partial();

export {
  UserSchema,
  ProviderSchema,
  CategorySchema,
  ProviderCategorySchema,
  OrderSchema,
  PaymentSchema,
  ReviewSchema,
  CreateUserSchema,
  CreateProviderSchema,
  CreateCategorySchema,
  CreateOrderSchema,
  CreatePaymentSchema,
  CreateReviewSchema,
  UpdateUserSchema,
  UpdateProviderSchema,
  UpdateCategorySchema,
  UpdateOrderSchema,
  UpdatePaymentSchema,
  UpdateReviewSchema,
};