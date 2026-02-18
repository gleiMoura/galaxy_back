import { Request, Response } from "express";
import { createPayment, getPayment, getPayments } from "../../src/controllers/paymentController"; // Ajuste o caminho
import * as paymentService from "../../src/services/paymentService"; // Ajuste o caminho

// Mock do módulo de serviço
jest.mock("../../src/services/paymentService");

describe("Payment Controllers", () => {
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
        // O .status() deve retornar 'this' para permitir o encadeamento .status(200).send(...)
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    // ------------------------------------------------------------------
    // 1. Testes para createPayment
    // ------------------------------------------------------------------
    describe("createPayment", () => {
        it("should call createNewPayment and return 200 with 'Created!' message", async () => {
            // ARRANGE
            req.body = { studentId: 10, value: 500 };
            
            // Mock de sucesso
            (paymentService.createNewPayment as jest.Mock).mockResolvedValue(true);

            // ACT
            await createPayment(req as Request, res as Response);

            // ASSERT
            expect(paymentService.createNewPayment).toHaveBeenCalledWith(req.user, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith("Created!");
        });

        it("should bubble up error if service fails (e.g. 400 Permission denied)", async () => {
            // ARRANGE
            req.user = { id: 5, role: "Student", email: "student@school.com" };
            
            const errorMock = { 
                response: { status: 400, message: "Usuário não tem permissão!" } 
            };
            
            (paymentService.createNewPayment as jest.Mock).mockRejectedValue(errorMock);

            // ACT & ASSERT
            await expect(createPayment(req as Request, res as Response)).rejects.toEqual(errorMock);
            expect(res.status).not.toHaveBeenCalled();
        });
    });

    // ------------------------------------------------------------------
    // 2. Testes para getPayment (ById)
    // ------------------------------------------------------------------
    describe("getPayment", () => {
        it("should return 200 and the payment object", async () => {
            // ARRANGE
            req.params = { id: "123" };
            const mockPayment = { id: 123, value: 200, status: "paid" };

            (paymentService.findPayment as jest.Mock).mockResolvedValue(mockPayment);

            // ACT
            await getPayment(req as Request, res as Response);

            // ASSERT
            expect(paymentService.findPayment).toHaveBeenCalledWith(req.user, "123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockPayment);
        });

        it("should bubble up error if payment is not found (404) or ID missing", async () => {
            // ARRANGE
            req.params = {}; // ID faltando
            const errorMock = { 
                response: { status: 404, message: "Id é necessário para achar pagamento" } 
            };

            (paymentService.findPayment as jest.Mock).mockRejectedValue(errorMock);

            // ACT & ASSERT
            await expect(getPayment(req as Request, res as Response)).rejects.toEqual(errorMock);
        });
    });

    // ------------------------------------------------------------------
    // 3. Testes para getPayments (All)
    // ------------------------------------------------------------------
    describe("getPayments", () => {
        it("should return 200 and the list/object of payments", async () => {
            // ARRANGE
            // Simulando retorno para um Admin (que recebe objeto com student/teacher payments)
            const mockResult = {
                student: [{ id: 1, value: 100 }],
                teacher: [{ id: 2, value: 500 }]
            };

            (paymentService.findPayments as jest.Mock).mockResolvedValue(mockResult);

            // ACT
            await getPayments(req as Request, res as Response);

            // ASSERT
            expect(paymentService.findPayments).toHaveBeenCalledWith(req.user);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockResult);
        });

        it("should bubble up error if service fails (e.g. 500 not found)", async () => {
            // ARRANGE
            const errorMock = { 
                response: { status: 500, message: "Não foi possível encontrar o pagamento no momento." } 
            };

            (paymentService.findPayments as jest.Mock).mockRejectedValue(errorMock);

            // ACT & ASSERT
            await expect(getPayments(req as Request, res as Response)).rejects.toEqual(errorMock);
            expect(res.send).not.toHaveBeenCalled();
        });
    });
});