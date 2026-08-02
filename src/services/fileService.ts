import { FileRepository } from "../repository/filesRepository";
import { AppError } from "../interfaces";

export class FileService {
    /**
     * Processa e envia arquivos PÚBLICOS (ex: avatares, fotos de perfil)
     */
    static async createPublicFileLink(
        file?: Express.Multer.File,
        folder: string = 'profiles'
    ): Promise<string> {
        if (!file || !file.buffer || !file.originalname) {
            throw new AppError("Arquivo inválido ou propriedades obrigatórias ausentes.", 400);
        }

        return await FileRepository.uploadPublicFile(file, folder);
    }

    /**
     * Processa e envia arquivos PRIVADOS (ex: PDFs de aulas, comprovantes, faturas)
     */
    static async createPrivateFileLink(
        file?: Express.Multer.File,
        folder: string = 'documents'
    ): Promise<string> {
        if (!file || !file.buffer || !file.originalname) {
            throw new AppError("Arquivo inválido ou propriedades obrigatórias ausentes.", 400);
        }

        return await FileRepository.uploadPrivateFile(file, folder);
    }

    /**
     * Gera URL assinada temporária para leitura de arquivos PRIVADOS
     */
    static async getPrivateSignedUrl(
        filePath: string,
        expiresInMinutes: number = 15
    ): Promise<string> {
        if (!filePath) {
            throw new AppError("Caminho do arquivo não fornecido.", 400);
        }

        return await FileRepository.generatePrivateSignedUrl(filePath, expiresInMinutes);
    }
}