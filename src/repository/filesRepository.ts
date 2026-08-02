import { GetSignedUrlConfig } from '@google-cloud/storage';
import { publicBucket, privateBucket } from "../config/cloud";

export class FileRepository {
  /**
   * Envia arquivos PÚBLICOS (ex: avatares, fotos de perfil, mídias institucionais)
   * O bucket público deve ter a permissão 'allUsers' -> 'roles/storage.objectViewer' no GCP.
   */
  static async uploadPublicFile(
    file: Express.Multer.File,
    folder: string = 'profiles'
  ): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error("Arquivo ou buffer inválido para upload.");
    }

    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const gcsFile = publicBucket.file(fileName);

    return new Promise((resolve, reject) => {
      const stream = gcsFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      stream.on("error", (error) => {
        console.error("Erro no upload para o bucket público do GCS:", error);
        reject(new Error("Falha ao salvar o arquivo público no Google Cloud Storage."));
      });

      stream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${publicBucket.name}/${fileName}`;
        resolve(publicUrl);
      });

      stream.end(file.buffer);
    });
  }

  /**
   * Envia arquivos PRIVADOS (ex: PDFs de aula, faturas, contratos)
   * Salva o objeto no bucket privado e retorna o caminho relativo do arquivo (Path).
   */
  static async uploadPrivateFile(
    file: Express.Multer.File,
    folder: string = 'documents'
  ): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error("Arquivo ou buffer inválido para upload.");
    }

    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const gcsFile = privateBucket.file(fileName);

    return new Promise((resolve, reject) => {
      const stream = gcsFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      stream.on("error", (error) => {
        console.error("Erro no upload para o bucket privado do GCS:", error);
        reject(new Error("Falha ao salvar o documento privado no Google Cloud Storage."));
      });

      stream.on("finish", () => {
        resolve(fileName);
      });

      stream.end(file.buffer);
    });
  }

  /**
   * Gera uma Signed URL temporária para leitura de arquivos PRIVADOS
   * @param fileName Caminho relativo do arquivo (ex: 'documents/1722500000-abc1234.pdf')
   * @param expiresInMinutes Tempo de expiração do link em minutos (Padrão: 15min)
   */
  static async generatePrivateSignedUrl(
    fileName: string,
    expiresInMinutes: number = 15
  ): Promise<string> {
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    };

    const [signedUrl] = await privateBucket.file(fileName).getSignedUrl(options);
    return signedUrl;
  }
}