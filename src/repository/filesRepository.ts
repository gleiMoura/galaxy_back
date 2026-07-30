import { bucket } from "../config/cloud";

export const generateFileLink = async (file: Express.Multer.File): Promise<string> => {
  if (!file || !file.buffer) {
    throw new Error("Arquivo ou buffer inválido para upload.");
  }

  // Gera um nome único para o arquivo no bucket para evitar substituições
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `profiles/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
  const gcsFile = bucket.file(fileName);

  // Upload via stream em memória
  return new Promise((resolve, reject) => {
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    stream.on("error", (error) => {
      console.error("Erro no upload do GCS:", error);
      reject(new Error("Falha ao salvar a foto de perfil no Google Cloud Storage."));
    });

    stream.on("finish", async () => {
      try {
        // Torna o arquivo público e gera a URL pública de acesso
        await gcsFile.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(publicUrl);
      } catch (err) {
        reject(new Error("Erro ao definir visibilidade pública no GCS."));
      }
    });

    stream.end(file.buffer);
  });
};