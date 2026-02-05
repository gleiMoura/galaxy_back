// tests/registerController.test.ts
import { doRegister, insertProfileImage } from '../../src/controllers/registerController';
import * as registerService from '../../src/services/registerService';
import * as filesRepository from '../../src/repository/filesRepository';
import { Request, Response } from 'express';

// 1. MOCK DAS DEPENDÊNCIAS
// Dizemos ao Jest para substituir as funções reais por funções monitoráveis
jest.mock('../../src/services/registerService');
jest.mock('../../src/repository/filesRepository');

describe('Register Controller', () => {
    
    // Variáveis para simular req e res
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockSend: jest.Mock;
    let mockSendStatus: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        // Configuração padrão dos Mocks do Express
        mockStatus = jest.fn().mockReturnThis(); // Permite encadear .status().send()
        mockSend = jest.fn();
        mockSendStatus = jest.fn();

        mockRes = {
            status: mockStatus,
            send: mockSend,
            sendStatus: mockSendStatus,
        };
    });

    // =================================================================
    // TESTE: doRegister
    // =================================================================
    describe('doRegister', () => {
        it('deve chamar o service com as credenciais e retornar status 201', async () => {
            // ARRANGE
            const credentials = { email: 'teste@galaxy.com', password: '123' };
            mockReq = {
                body: credentials
            };

            // ACT
            await doRegister(mockReq as Request, mockRes as Response);

            // ASSERT
            // 1. Verificamos se o Service foi chamado com o body correto
            expect(registerService.logUser).toHaveBeenCalledWith(credentials);
            // 2. Verificamos se respondeu 201 Created
            expect(mockRes.sendStatus).toHaveBeenCalledWith(201);
        });
    });

    // =================================================================
    // TESTE: insertProfileImage
    // =================================================================
    describe('insertProfileImage', () => {
        it('deve lançar erro 404 se nenhum arquivo for enviado', async () => {
            // ARRANGE
            mockReq = {
                file: undefined, // Simulando falta de arquivo
                user: { email: 'user@galaxy.com' } // Simulando usuário autenticado
            } as any; // Cast para any pois 'user' não existe no tipo Request padrão sem modificação

            // ACT & ASSERT
            await expect(insertProfileImage(mockReq as Request, mockRes as Response))
                .rejects
                .toEqual({
                    response: {
                        status: 404,
                        message: "File need to be sent"
                    }
                });
        });

        it('deve processar o upload, gerar link e retornar o perfil atualizado', async () => {
            // ARRANGE
            const mockFile = { filename: 'avatar.jpg' } as any; // Arquivo falso do Multer
            const mockUserEmail = 'user@galaxy.com';
            const mockLink = 'https://storage.google.com/bucket/avatar.jpg';
            const mockUpdatedProfile = { id: 1, email: mockUserEmail, profileUrl: mockLink };

            mockReq = {
                file: mockFile,
                user: { email: mockUserEmail }
            } as any;

            // Ensinamos os mocks o que retornar
            (filesRepository.generateFileLink as jest.Mock).mockResolvedValue(mockLink);
            (registerService.logUserWithProfileLink as jest.Mock).mockResolvedValue(mockUpdatedProfile);

            // ACT
            await insertProfileImage(mockReq as Request, mockRes as Response);

            // ASSERT
            // 1. Verificamos se o link foi gerado
            expect(filesRepository.generateFileLink).toHaveBeenCalledWith(mockFile);
            
            // 2. Verificamos se o service de logUser foi chamado com link e email
            expect(registerService.logUserWithProfileLink).toHaveBeenCalledWith(mockUserEmail, mockLink);
            
            // 3. Verificamos a resposta HTTP: Status 201 e o objeto JSON
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.send).toHaveBeenCalledWith(mockUpdatedProfile);
        });
    });
});