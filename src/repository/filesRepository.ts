import { bucket, bucketName } from "../config/cloud.js";

// Set para controlar arquivos que estão em processo de upload
const uploadInProgress = new Set();

export const generateProfileLink = async (file) => {
    try {
        if (!file || !file.path || !file.originalname) {
            throw new Error("File is not valid or missing required properties");
        }

        const filePath = file.path;
        const fileName = file.originalname;

        // Verificar se o arquivo já está em processo de upload
        if (uploadInProgress.has(fileName)) {
            console.log('Upload já está em progresso para esse arquivo.');
            return;
        }

        // Adiciona o arquivo ao conjunto de uploads em progresso
        uploadInProgress.add(fileName);

        const destination = bucket.file(fileName);

        // Realiza o upload
        await bucket.upload(filePath, {
            destination: fileName,
        });

        // Torna o arquivo público
        await destination.makePublic();

        // Gera o link público
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

        // Remove o arquivo do conjunto após o upload
        uploadInProgress.delete(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Erro no upload:', error);
        // Remove o arquivo do conjunto em caso de erro também
        if (file && file.originalname) {
            uploadInProgress.delete(file.originalname);
        }
        throw new Error('Falha ao gerar link do perfil: ' + error.message);
    }
};
