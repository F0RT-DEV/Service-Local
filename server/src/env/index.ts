import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  HOST: z.string(),
  USER: z.string(),
  PASSWORD: z.string(),
  DATABASE: z.string(),
  PORT: z.coerce.number().default(3306),
  APP_PORT: z.coerce.number().default(3001),
  JWT_SECRET:z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('⚠️ Variáveis de ambiente inválidas', _env.error.format());
  throw new Error('Variáveis de ambiente inválidas');
}

export const env = _env.data;
