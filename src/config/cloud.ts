import { Storage } from '@google-cloud/storage';
import { config } from 'dotenv';

config();

const credentials = {
    type: process.env.GOOGLE_CREDENTIALS_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
};

const storage = new Storage({
    projectId: 'socialcar-442819',
    credentials: credentials
});


// Referência ao bucket
const bucketName = 'socialcar'; // Substitua pelo nome do seu bucket
const bucket = storage.bucket(bucketName);

export {
    bucketName,
    bucket
};