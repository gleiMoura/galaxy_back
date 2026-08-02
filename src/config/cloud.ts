import { Storage } from '@google-cloud/storage';
import { env } from './env';

export const storage = new Storage({
  projectId: env.GOOGLE_PROJECT_ID,
});

// Buckets isolados por finalidade de segurança
export const publicBucket = storage.bucket(env.GCP_PUBLIC_BUCKET);
export const privateBucket = storage.bucket(env.GCP_PRIVATE_BUCKET);