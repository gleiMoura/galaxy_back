import { Storage } from '@google-cloud/storage';
import { env } from './env'; // Importa nossas variáveis já validadas pelo Zod

/**
 * Instancia o cliente do Google Cloud Storage.
 *
 * Em produção/Cloud Run: O Workload Identity Federation ou a Service Account
 * anexada ao serviço autentica automaticamente sem arquivo JSON (Application Default Credentials - ADC).
 *
 * Em desenvolvimento local: Basta rodar 'gcloud auth application-default login' no terminal uma única vez.
 */
export const storage = new Storage({
  projectId: env.GOOGLE_PROJECT_ID, // Zod garante que nunca será 'undefined'
});

export const bucket = storage.bucket(env.GOOGLE_BUCKET_NAME); // Zod garante que nunca será 'undefined'