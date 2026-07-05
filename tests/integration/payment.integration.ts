import request from "supertest";
import app from "../../src/app.js";
import jwt from "jsonwebtoken";
import * as paymentRepository from "../../src/repository/paymentRepository.js";

// Mocks do Repositório
jest.mock("../../src/repository/paymentRepository.js");

// Mock do prisma para silenciar logs
jest.mock("../../src/config/index.js", () => ({
    __esModule: true,
    default: {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    },
}));

describe("Payment Integration Tests", () => {
    const JWT_SECRET = process.env.JWT_SECRET || "sua_secret_aqui";

    const generateTestToken = (payload: object) => {
        return jwt.sign(payload, JWT_SECRET);
    };

    // Usuários mockados para testar as regras de acesso
    const adminUser = { id: 1, email: "admin@test.com", role: "Admin" };
    const studentUser = { id: 2, email: "student@test.com", role: "Student" };
    const teacherUser = { id: 3, email: "teacher@test.com", role: "Teacher" };

    // Payload válido de acordo com o seu studentPaymentSchema
    const validPaymentPayload = {
        studentId: 10,
        amount: 150.50,
        dueDate: "2026-04-10T00:00:00.000Z", // isoDate
        status: "PENDING",
        invoiceUrl: "http://dominio.com/fatura.pdf"
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    // =========================================================================
    // POST /payment/student
    // =========================================================================
    describe("POST /payment/student", () => {
        it("should return 200 and 'Created!' if user is Admin", async () => {
            const token = generateTestToken(adminUser);
            
            // Simula o sucesso na criação no banco
            (paymentRepository.createStudentPaymentInDb as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post("/payment/student")
                .set("Authorization", `Bearer ${token}`)
                .send(validPaymentPayload);

            expect(response.status).toBe(200);
            expect(response.text).toBe("Created!"); // Controller envia string
            expect(paymentRepository.createStudentPaymentInDb).toHaveBeenCalledWith(validPaymentPayload);
        });

        it("should return 400 if a Student tries to create a payment", async () => {
            const token = generateTestToken(studentUser);

            const response = await request(app)
                .post("/payment/student")
                .set("Authorization", `Bearer ${token}`)
                .send(validPaymentPayload);

            expect(response.status).toBe(400);
            expect(response.text).toBe("Usuário não tem permissão!");
        });

        it("should return validation error if required fields are missing", async () => {
            const token = generateTestToken(adminUser);
            const invalidPayload = { studentId: 10 }; // Faltam amount, dueDate, invoiceUrl

            const response = await request(app)
                .post("/payment/student")
                .set("Authorization", `Bearer ${token}`)
                .send(invalidPayload);

            // Dependendo de como seu schemaValidator lança o erro, pode ser 400 ou 404
            expect(response.status).toBeGreaterThanOrEqual(400); 
            expect(paymentRepository.createStudentPaymentInDb).not.toHaveBeenCalled();
        });

        it("should return 500 if database fails to create payment", async () => {
            const token = generateTestToken(adminUser);
            
            // Simula falha no banco (retorna null)
            (paymentRepository.createStudentPaymentInDb as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post("/payment/student")
                .set("Authorization", `Bearer ${token}`)
                .send(validPaymentPayload);

            expect(response.status).toBe(500);
            expect(response.text).toBe("Não foi possível criar o pagamento no momento.");
        });
    });

    // =========================================================================
    // GET /payment/student/:id
    // =========================================================================
    describe("GET /payment/student/:id", () => {
        it("should return 200 and student payment if requested by a Student", async () => {
            const token = generateTestToken(studentUser);
            const mockPayment = { id: 5, ...validPaymentPayload };

            (paymentRepository.getStudentPaymentInDb as jest.Mock).mockResolvedValue(mockPayment);

            const response = await request(app)
                .get("/payment/student/5")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPayment);
            expect(paymentRepository.getStudentPaymentInDb).toHaveBeenCalledWith(5);
        });

        it("should return 200 and an object with both student and teacher payments if Admin", async () => {
            const token = generateTestToken(adminUser);
            const mockStudentPayment = { id: 5, amount: 100 };
            const mockTeacherPayment = { id: 5, amount: 500 };

            (paymentRepository.getStudentPaymentInDb as jest.Mock).mockResolvedValue(mockStudentPayment);
            (paymentRepository.getTeacherPaymentInDb as jest.Mock).mockResolvedValue(mockTeacherPayment);

            const response = await request(app)
                .get("/payment/student/5")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            // Verifica o objeto complexo retornado para o Admin
            expect(response.body).toEqual({
                student: mockStudentPayment,
                teacher: mockTeacherPayment
            });
        });

        it("should return 500 if no payment is found in DB", async () => {
            const token = generateTestToken(studentUser);
            
            (paymentRepository.getStudentPaymentInDb as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/payment/student/99")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.text).toBe("Não foi possível encontrar o pagamento no momento.");
        });
    });

    // =========================================================================
    // GET /payments/student
    // =========================================================================
    describe("GET /payments/student", () => {
        it("should return 200 and an array of payments for a Student", async () => {
            const token = generateTestToken(studentUser);
            const mockPaymentsList = [validPaymentPayload, validPaymentPayload];

            (paymentRepository.getStudentPaymentsInDb as jest.Mock).mockResolvedValue(mockPaymentsList);

            const response = await request(app)
                .get("/payments/student")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPaymentsList);
        });

        it("should return 200 and an object containing lists for Admin", async () => {
            const token = generateTestToken(adminUser);
            const mockStudentPaymentsList = [{ id: 1 }];
            const mockTeacherPaymentsList = [{ id: 2 }];

            (paymentRepository.getStudentPaymentsInDb as jest.Mock).mockResolvedValue(mockStudentPaymentsList);
            (paymentRepository.getTeacherPaymentsInDb as jest.Mock).mockResolvedValue(mockTeacherPaymentsList);

            const response = await request(app)
                .get("/payments/student")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.student).toEqual(mockStudentPaymentsList);
            expect(response.body.teacher).toEqual(mockTeacherPaymentsList);
        });

        it("should return 500 if DB fetching fails", async () => {
            const token = generateTestToken(teacherUser); // Usando teacher para testar a rota getTeacherPaymentsInDb

            (paymentRepository.getTeacherPaymentsInDb as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/payments/student")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.text).toBe("Não foi possível encontrar o pagamento no momento.");
        });
    });
});