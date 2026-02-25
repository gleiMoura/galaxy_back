import request from "supertest";
import app from "../../src/app.js"; 
import * as studentRepository from "../../src/repository/studentRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock do Repositório
jest.mock("../../src/repository/studentRepository.js");

describe("Login Integration Tests", () => {
    const JWT_SECRET = process.env.JWT_SECRET || "sua_secret_aqui";
    const plainPassword = "password123";
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    const mockUser = {
        id: 1,
        name: "User Test",
        email: "test@example.com",
        password: hashedPassword, 
        role: "Teacher"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /login", () => {
        it("should return 201 and user info with token on successful login", async () => {
            (studentRepository.findUser as jest.Mock).mockResolvedValue(mockUser);

            const loginCredentials = {
                email: "test@example.com",
                password: plainPassword
            };

            const response = await request(app)
                .post("/login")
                .send(loginCredentials);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("token");
            expect(response.body.email).toBe(mockUser.email);
            expect(response.body.password).toBeUndefined(); 
            
            const decoded = jwt.verify(response.body.token, JWT_SECRET) as any;
            expect(decoded.email).toBe(mockUser.email);
            expect(decoded.role).toBe(mockUser.role);
        });

        it("should return 404 if email does not exist", async () => {
            (studentRepository.findUser as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post("/login")
                .send({ email: "wrong@example.com", password: plainPassword });

            expect(response.status).toBe(404);
            
            // Alterado de response.body.message para response.text devido ao uso de .send() no errorHandler
            expect(response.text).toBe("Usuário ou senha incorretos!");
        });

        it("should return 404 if password is incorrect", async () => {
            (studentRepository.findUser as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post("/login")
                .send({ email: "test@example.com", password: "wrong_password" });

            expect(response.status).toBe(404);
            
            // Alterado para response.text
            expect(response.text).toBe("Usuário ou senha incorretos!");
        });

        it("should return 400 (or validation error) if email is invalid", async () => {
            const response = await request(app)
                .post("/login")
                .send({ email: "not-an-email", password: plainPassword });

            expect(response.status).not.toBe(201);
        });
    });
});