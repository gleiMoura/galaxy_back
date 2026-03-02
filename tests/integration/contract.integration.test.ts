import request from "supertest";
import app from "../../src/app.js";
import jwt from "jsonwebtoken";
import * as contractRepository from "../../src/repository/contractRepository.js";
import * as studentRepository from "../../src/repository/studentRepository.js";

// Mocks
jest.mock("../../src/repository/contractRepository.js");
jest.mock("../../src/repository/studentRepository.js");

// Mock do prisma para silenciar logs
jest.mock("../../src/config/index.js", () => ({
    __esModule: true,
    default: {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    },
}));

describe("Contract Integration Tests", () => {
    const JWT_SECRET = process.env.JWT_SECRET || "sua_secret_aqui";

    const generateTestToken = (payload: object) => {
        return jwt.sign(payload, JWT_SECRET);
    };

    // Usuários mockados para testar regras de negócio
    const adminUser = { id: 1, email: "admin@test.com", role: "Admin" };
    const teacherUser = { id: 2, email: "teacher@test.com", role: "Teacher" };
    const studentUser = { id: 3, email: "student@test.com", role: "Student" };

    // Payload válido que passa perfeitamente no contractSchema
    const validContractPayload = {
        id: 1, // Exigido pelo schema
        startDate: "2026-03-01T00:00:00Z",
        endDate: "2026-12-01T00:00:00Z",
        lessonsPerWeek: 2,
        usedLessons: 0,
        contractTotalLessons: 20,
        firstMonthLessons: 4,
        secondMonthLessons: 4,
        thirdMonthLessons: 4,
        signed: false,
        planId: 10,
        studentId: 5,
        teacherId: 2
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    // =========================================================================
    // POST /contract
    // =========================================================================
    describe("POST /contract", () => {
        it("should return 201 and create a contract if user is not a Teacher", async () => {
            const token = generateTestToken(adminUser);

            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            (contractRepository.createContractInDb as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post("/contract")
                .set("Authorization", `Bearer ${token}`)
                .send(validContractPayload);

            // O controller usa res.sendStatus(201)
            expect(response.status).toBe(201);
            expect(contractRepository.createContractInDb).toHaveBeenCalledWith(validContractPayload);
        });

        it("should return 400 if a Teacher tries to create a contract", async () => {
            const token = generateTestToken(teacherUser);

            (studentRepository.findUser as jest.Mock).mockResolvedValue(teacherUser);

            const response = await request(app)
                .post("/contract")
                .set("Authorization", `Bearer ${token}`)
                .send(validContractPayload);

            expect(response.status).toBe(400);
            expect(response.text).toBe("Usuário não tem permissão!");
        });
    });

    // =========================================================================
    // GET /contracts
    // =========================================================================
    describe("GET /contracts", () => {
        it("should return 200 and a list of contracts for Admin", async () => {
            const token = generateTestToken(adminUser);
            const mockList = [validContractPayload];

            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            (contractRepository.getContractsInDb as jest.Mock).mockResolvedValue(mockList);

            const response = await request(app)
                .get("/contracts")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockList);
        });

        it("should return 400 if a non-Admin tries to get all contracts", async () => {
            const token = generateTestToken(studentUser);
            (studentRepository.findUser as jest.Mock).mockResolvedValue(studentUser);

            const response = await request(app)
                .get("/contracts")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.text).toBe("Usuário não tem permissão!");
        });
    });

    // =========================================================================
    // GET /contract/:id
    // =========================================================================
    describe("GET /contract/:id", () => {
        it("should return 200 and the specific contract for Admin", async () => {
            const token = generateTestToken(adminUser);

            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            (contractRepository.getContractInDb as jest.Mock).mockResolvedValue(validContractPayload);

            const response = await request(app)
                .get("/contract/1")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(validContractPayload);
        });
    });

    // =========================================================================
    // PUT /contract
    // =========================================================================
    describe("PUT /contract", () => {
        it("should return 200 and update the contract if unsigned", async () => {
            const token = generateTestToken(adminUser);

            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            (contractRepository.changeContractInDb as jest.Mock).mockResolvedValue(validContractPayload);

            const response = await request(app)
                .put("/contract")
                .set("Authorization", `Bearer ${token}`)
                .send(validContractPayload);

            expect(response.status).toBe(200);
            expect(contractRepository.changeContractInDb).toHaveBeenCalled();
        });

        it("should return 409 if trying to update an already signed contract", async () => {
            const token = generateTestToken(adminUser);
            const signedPayload = { ...validContractPayload, signed: true };

            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);

            const response = await request(app)
                .put("/contract")
                .set("Authorization", `Bearer ${token}`)
                .send(signedPayload);

            expect(response.status).toBe(409);
            expect(response.text).toBe("Usuário já assinou o contrato. Não é possível mudá-lo.");
        });
    });

    // =========================================================================
    // DELETE /contract/:id
    // =========================================================================
    describe("DELETE /contract/:id", () => {
        it("should return 200 and delete the contract if unsigned", async () => {
            const token = generateTestToken(adminUser);

            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            // Simula a busca do contrato no banco provando que não está assinado
            (contractRepository.getContractInDb as jest.Mock).mockResolvedValue(validContractPayload);
            (contractRepository.deleteContractInDb as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete("/contract/1")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(contractRepository.deleteContractInDb).toHaveBeenCalledWith(1);
        });

        it("should return 409 if trying to delete an already signed contract", async () => {
            const token = generateTestToken(adminUser);
            const signedContractFromDb = { ...validContractPayload, signed: true };

            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            // Simula o banco retornando um contrato que já foi assinado
            (contractRepository.getContractInDb as jest.Mock).mockResolvedValue(signedContractFromDb);

            const response = await request(app)
                .delete("/contract/1")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(409);
            expect(response.text).toBe("Usuário já assinou o contrato. Não é possível deletá-lo.");
            expect(contractRepository.deleteContractInDb).not.toHaveBeenCalled();
        });
    });
});