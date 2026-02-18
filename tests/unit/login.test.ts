import { doLogin } from "../../src/controllers/loginController";
// Ajuste esta importação conforme o seu export (default ou named)
import signinUser from "../../src/services/loginService";
import { Request, Response } from "express";

// Mock do service
jest.mock("../../src/services/loginService");

describe('Login Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockSend: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockStatus = jest.fn().mockReturnThis();
        mockSend = jest.fn().mockReturnThis();

        mockRes = {
            status: mockStatus,
            send: mockSend,
        };
    });

    describe('doLogin', () => {
        it('deve retornar status 201 e dados do usuário em caso de sucesso', async () => {
            // ARRANGE
            const credentials = { email: 'teste@galaxy.com', password: '123' };
            mockReq = { body: credentials };

            const userInformation = { id: 1, name: 'Test User', token: 'abc123' };
            // Se usou export default, o Jest trata assim:
            (signinUser as jest.Mock).mockResolvedValue(userInformation);

            // ACT
            await doLogin(mockReq as Request, mockRes as Response);

            // ASSERT
            expect(signinUser).toHaveBeenCalledWith(credentials);
            expect(mockStatus).toHaveBeenCalledWith(201); // Verificamos o status primeiro
            expect(mockSend).toHaveBeenCalledWith(userInformation);
        });

        it('must send the error to be captured by global middleware', async () => {
            // ARRANGE
            mockReq = { body: { email: 'errado@galaxy.com', password: '000' } };
            const errorResponse = {
                response: { message: "Usuário ou senha incorretos!", status: 404 }
            };
            (signinUser as jest.Mock).mockRejectedValue(errorResponse);

            await expect(doLogin(mockReq as Request, mockRes as Response))
                .rejects
                .toEqual(errorResponse);

            expect(mockStatus).not.toHaveBeenCalled();
            expect(mockSend).not.toHaveBeenCalled();
        });

        it('must send the error to be captured by error middleware', async () => {
            const errorResponse = {
                response: {
                    message: "Erro interno",
                    status: 500
                }
            };

            (signinUser as jest.Mock).mockRejectedValue(errorResponse);

            await expect(doLogin(mockReq as Request, mockRes as Response))
                .rejects
                .toEqual(errorResponse);
        });
    });
});