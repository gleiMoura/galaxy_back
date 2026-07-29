import dotenv from 'dotenv';
import { z } from 'zod';

// Executado ANTES de ler as variáveis
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL deve ser uma URL Postgres válida' }),
  GOOGLE_PROJECT_ID: z.string().min(1, 'GOOGLE_PROJECT_ID é obrigatório'),
  GOOGLE_BUCKET_NAME: z.string().min(1, 'GOOGLE_BUCKET_NAME é obrigatório'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Erro de configuração: Variáveis de ambiente ausentes ou inválidas:');
  console.error(_env.error.format());
  throw new Error('Variáveis de ambiente inválidas.');
}

// Inferred Type estrito: string puro para todos os campos obrigatórios
export const env = _env.data;