import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import prisma from "../../src/config/index.js";
import * as filesRepository from "../../src/repository/filesRepository.js";
import * as studentRepository from "../../src/repository/studentRepository.js";

// Mocks
jest.mock("../../src/config/index.js", () => ({
    __esModule: true,
    default: {
        teacher: { create: jest.fn(), update: jest.fn() },
        student: { create: jest.fn(), update: jest.fn() },
        admin: { create: jest.fn(), update: jest.fn() },
    },
}));

jest.mock("../../src/repository/filesRepository.js");
jest.mock("../../src/repository/studentRepository.js");

describe("Register Integration Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /register/student", () => {
        const studentData = {
            name: "João Silva",
            email: "joao@email.com",
            password: "password123",
            role: "Student",
            interests: ["Math", "Physics"],
            guardianName: "Maria Silva",
            phone: "11999999999",
            guardianPhone: "11888888888",
            shortTermGoal: "Pass exams",
            longTermGoal: "Engineer",
            schoolYear: 10
        };

        it("should return 201 when registering a new student successfully", async () => {
            (studentRepository.findUser as jest.Mock).mockResolvedValue(null);
            (prisma.student.create as jest.Mock).mockResolvedValue({ id: 1, ...studentData });

            const response = await request(app)
                .post("/register/student") // Rota atualizada
                .send(studentData);

            expect(response.status).toBe(201);
            expect(prisma.student.create).toHaveBeenCalled();
        });

        it("should return 409 if user email already exists", async () => {
            (studentRepository.findUser as jest.Mock).mockResolvedValue({ id: 1, email: studentData.email });

            const response = await request(app)
                .post("/register/student") // Rota atualizada
                .send(studentData);

            expect(response.status).toBe(409);
        });

        it("should return 400 if repository fails to create user", async () => {
            (studentRepository.findUser as jest.Mock).mockResolvedValue(null);
            (prisma.student.create as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post("/register/student") // Rota atualizada
                .send(studentData);

            expect(response.status).toBe(400);
        });
    });

    const JWT_SECRET = process.env.JWT_SECRET || "sua_secret_aqui";

    const generateTestToken = (payload: object) => {
        return jwt.sign(payload, JWT_SECRET);
    };

    describe("PUT /register/profile", () => {
        const mockUser = { email: "user@test.com", role: "Teacher" };
        const validToken = "Bearer token_fake";

        it("should return 201 and profileUrl when image is uploaded successfully", async () => {
            const token = generateTestToken({ id: 1, email: mockUser.email, role: mockUser.role });
            (studentRepository.findUser as jest.Mock).mockResolvedValue(mockUser);
            (filesRepository.generateFileLink as jest.Mock).mockResolvedValue("http://cdn.com/profile.jpg");
            (prisma.teacher.update as jest.Mock).mockResolvedValue({ ...mockUser, profileUrl: "http://cdn.com/profile.jpg" });

            const response = await request(app)
                .put("/register/profile") // Rota atualizada para PUT e caminho correto
                .set("Authorization", `Bearer ${token}`)
                .attach("file", Buffer.from("fake-image"), "test.jpg");

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("profileUrl", "http://cdn.com/profile.jpg");
        });

        it("should return 404 if no file is sent", async () => {
            const token = generateTestToken({ id: 1, email: mockUser.email, role: mockUser.role });
            // Importante: findUser é chamado no service, então o mock do user é necessário aqui
            (studentRepository.findUser as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .put("/register/profile") // Rota atualizada
                .set("Authorization", `Bearer ${token}`)


            expect(response.status).toBe(404);
        });

        it("should return 409 if user in token does not exist in DB", async () => {
            const token = generateTestToken({ id: 1, email: "user@test.com", role: "Teacher" });
            (studentRepository.findUser as jest.Mock).mockResolvedValue(null);
            (filesRepository.generateFileLink as jest.Mock).mockResolvedValue("http://link.com");

            const response = await request(app)
                .put("/register/profile") // Rota atualizada
                .set("Authorization", `Bearer ${token}`)
                .attach("file", Buffer.from("image"), "img.png");

            expect(response.status).toBe(409);
        });
    });
});