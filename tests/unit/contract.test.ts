import { Request, Response } from "express";
import {
    createContract,
    getContracts,
    getContract,
    updateContract,
    deleteContract
} from "../../src/controllers/contractController"; // Ajuste o caminho
import * as contractService from "../../src/services/contractService"; // Ajuste o caminho
import { ContractType, CustomError } from "../../src/interfaces"; // Ajuste o caminho das types

// Mock do módulo de serviço
jest.mock("../../src/services/contractService");

describe("Contract Controllers", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup padrão do Request
        req = {
            params: {},
            body: {},
            user: {
                id: 1,
                role: "Admin",
                email: "admin@school.com"
            }
        };

        // Setup do Response
        // Importante: Como seus controllers usam res.send().status(),
        // o mock do send() precisa retornar 'this' para permitir o encadeamento.
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis(),
        };
    });

    // ------------------------------------------------------------------
    // 1. createContract
    // ------------------------------------------------------------------
    describe("createContract", () => {
        it("should call makeContract and return 201 status", async () => {
            // Arrange
            req.body = {
                studentId: 10,
                planId: 2,
                startDate: new Date(),
                contractTotalLessons: 10
            };

            // Mock de sucesso (void)
            (contractService.makeContract as jest.Mock).mockResolvedValue(undefined);

            // Act
            await createContract(req as Request, res as Response);

            // Assert
            expect(contractService.makeContract).toHaveBeenCalledWith("admin@school.com", req.body);
            expect(res.sendStatus).toHaveBeenCalledWith(201);
        });

        it("should bubble up error if makeContract fails", async () => {
            // Arrange
            const errorMock = { response: { status: 400, message: "Usuário não tem permissão!" } };
            (contractService.makeContract as jest.Mock).mockRejectedValue(errorMock);

            // Act & Assert
            await expect(createContract(req as Request, res as Response)).rejects.toEqual(errorMock);
            expect(res.sendStatus).not.toHaveBeenCalled();
        });
    });

    // ------------------------------------------------------------------
    // 2. getContracts
    // ------------------------------------------------------------------
    describe("getContracts", () => {
        it("should return 200 and a list of contracts", async () => {
            // Arrange
            const mockContracts = [{ id: 1, studentId: 10 }, { id: 2, studentId: 12 }];
            (contractService.getAllContracts as jest.Mock).mockResolvedValue(mockContracts);

            // Act
            await getContracts(req as Request, res as Response);

            // Assert
            expect(contractService.getAllContracts).toHaveBeenCalledWith("admin@school.com");
            expect(res.send).toHaveBeenCalledWith(mockContracts);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("should bubble up error if getAllContracts fails", async () => {
            // Arrange
            const errorMock = { response: { status: 500, message: "Erro ao buscar contratos" } };
            (contractService.getAllContracts as jest.Mock).mockRejectedValue(errorMock);

            // Act & Assert
            await expect(getContracts(req as Request, res as Response)).rejects.toEqual(errorMock);
        });
    });

    // ------------------------------------------------------------------
    // 3. getContract (Single)
    // ------------------------------------------------------------------
    describe("getContract", () => {
        it("should return 200 and the specific contract", async () => {
            // Arrange
            req.params = { id: "123" };
            const mockContract = { id: 123, studentId: 5 };

            (contractService.findContract as jest.Mock).mockResolvedValue(mockContract);

            // Act
            await getContract(req as Request, res as Response);

            // Assert
            expect(contractService.findContract).toHaveBeenCalledWith("admin@school.com", "123");
            expect(res.send).toHaveBeenCalledWith(mockContract);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    // ------------------------------------------------------------------
    // 4. updateContract
    // ------------------------------------------------------------------
    describe("updateContract", () => {
        it("should return 200 and the updated contract", async () => {
            // Arrange
            const contractData: Partial<ContractType> = { id: 1, signed: true };
            req.body = contractData;

            const mockUpdatedContract = { ...contractData, updated: true };
            (contractService.changeContract as jest.Mock).mockResolvedValue(mockUpdatedContract);

            // Act
            await updateContract(req as Request, res as Response);

            // Assert
            expect(contractService.changeContract).toHaveBeenCalledWith("admin@school.com", contractData);
            expect(res.send).toHaveBeenCalledWith(mockUpdatedContract);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("should bubble up error (e.g. 409 conflict) if update fails", async () => {
            // Arrange
            req.body = { id: 1, signed: true };
            const errorMock = {
                response: { status: 409, message: "Usuário já assinou o contrato." }
            };

            (contractService.changeContract as jest.Mock).mockRejectedValue(errorMock);

            // Act & Assert
            await expect(updateContract(req as Request, res as Response)).rejects.toEqual(errorMock);
        });
    });

    // ------------------------------------------------------------------
    // 5. deleteContract
    // ------------------------------------------------------------------
    describe("deleteContract", () => {
        it("should return 200 and success result", async () => {
            // Arrange
            req.params = { id: "99" };
            const mockResult = { message: "Contrato deletado" };

            (contractService.finishContract as jest.Mock).mockResolvedValue(mockResult);

            // Act
            await deleteContract(req as Request, res as Response);

            // Assert
            expect(contractService.finishContract).toHaveBeenCalledWith("admin@school.com", "99");
            expect(res.send).toHaveBeenCalledWith(mockResult);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("should bubble up error (e.g. 400 permission) if delete fails", async () => {
            // Arrange
            req.params = { id: "99" };
            const errorMock = {
                response: { status: 400, message: "Usuário não tem permissão!" }
            };

            (contractService.finishContract as jest.Mock).mockRejectedValue(errorMock);

            // Act & Assert
            await expect(deleteContract(req as Request, res as Response)).rejects.toEqual(errorMock);
        });
    });
});