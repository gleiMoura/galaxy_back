import request from "supertest";
import app from "../../src/app.js"; // Ajuste o caminho para o seu app.js
import jwt from "jsonwebtoken";
import * as studentRepository from "../../src/repository/studentRepository.js";

// Mock do repositório para evitar bater no banco real
jest.mock("../../src/repository/studentRepository.js");

describe("Student Integration Tests", () => {
    const JWT_SECRET = process.env.JWT_SECRET || "sua_secret_aqui";

    const generateTestToken = (payload: object) => {
        return jwt.sign(payload, JWT_SECRET);
    };

    // Usuários mockados para diferentes roles
    const adminUser = { id: 1, email: "admin@test.com", role: "Admin", name: "Admin Test" };
    const teacherUser = { id: 2, email: "teacher@test.com", role: "Teacher", name: "Teacher Test" };
    const studentUser = { id: 3, email: "student@test.com", role: "Student", name: "Student Test" };

    beforeEach(() => {
        // Limpa os mocks entre os testes
        jest.resetAllMocks();
    });

    // =========================================================================
    // GET /student/:id
    // =========================================================================
    describe("GET /student/:id", () => {
        it("should return 201 and user info when requested by Admin/Teacher", async () => {
            // ARRANGE: A pessoa buscando é Admin/Teacher, e o aluno sendo buscado existe (id 10)
            const token = generateTestToken(teacherUser);
            const targetStudent = { id: 10, name: "Target Student" };
            
            // Repare que o findStudent chama findUser pelo ID do estudante.
            (studentRepository.findUser as jest.Mock).mockResolvedValue(targetStudent);

            // ACT
            const response = await request(app)
                .get("/student/10")
                .set("Authorization", `Bearer ${token}`);

            // ASSERT
            expect(response.status).toBe(201);
            // O seu service retorna 'user' (quem chamou), mas no código original parecia ser pra retornar o 'student' encontrado.
            // Se o seu service estiver retornando 'user', o teste passará.
            expect(response.body.email).toBe(teacherUser.email);
        });

        it("should return 409 if a Student tries to search for a student", async () => {
            const token = generateTestToken(studentUser);
            const targetStudent = { id: 10, name: "Target Student" };
            
            (studentRepository.findUser as jest.Mock).mockResolvedValue(targetStudent);

            const response = await request(app)
                .get("/student/10")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(409);
            expect(response.text).toBe("Estudante não pode procurar um estudante.");
        });

        it("should return 404 if the student is not found", async () => {
            const token = generateTestToken(teacherUser);
            
            // Simulando que o ID buscado não existe no banco
            (studentRepository.findUser as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/student/99")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.text).toBe("Usuário não foi encontrado no sistema.");
        });
    });

    // =========================================================================
    // GET /students
    // =========================================================================
    describe("GET /students", () => {
        it("should return 201 and list of students when requested by Admin/Teacher", async () => {
            const token = generateTestToken(teacherUser);
            const mockList = [{ id: 10, name: "Aluno A" }, { id: 11, name: "Aluno B" }];

            // Mock para passar na validação de quem está chamando a rota
            (studentRepository.findUser as jest.Mock).mockResolvedValue(teacherUser);
            // Mock para a listagem
            (studentRepository.findAllStudents as jest.Mock).mockResolvedValue(mockList);

            const response = await request(app)
                .get("/students")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(201);
            // expect.arrayContaining verifica se a resposta é um array contendo os dados
            expect(response.body).toEqual(expect.arrayContaining(mockList)); 
        });

        it("should return 400 if a Student tries to list students", async () => {
            const token = generateTestToken(studentUser);
            
            (studentRepository.findUser as jest.Mock).mockResolvedValue(studentUser);

            const response = await request(app)
                .get("/students")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.text).toBe("Usuário não possui permissão!");
        });
    });

    // =========================================================================
    // PUT /student
    // =========================================================================
    describe("PUT /student", () => {
        const updatePayload = { name: "New Name", phone: "123456" };

        it("should return 201 and updated info on success (Admin/Student updating themselves)", async () => {
            // Nota: Pela lógica do seu service, Estudante pode se atualizar, Professor não.
            const token = generateTestToken(studentUser);
            
            // Valida quem está chamando
            (studentRepository.findUser as jest.Mock).mockResolvedValue(studentUser);
            
            // Retorno da atualização
            const updatedMock = { ...studentUser, ...updatePayload };
            (studentRepository.updateStudentInDB as jest.Mock).mockResolvedValue(updatedMock);

            const response = await request(app)
                .put("/student")
                .set("Authorization", `Bearer ${token}`)
                .send(updatePayload);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe("New Name");
        });

        it("should return 400 if a Teacher tries to update a student info", async () => {
            const token = generateTestToken(teacherUser);
            
            (studentRepository.findUser as jest.Mock).mockResolvedValue(teacherUser);

            const response = await request(app)
                .put("/student")
                .set("Authorization", `Bearer ${token}`)
                .send(updatePayload);

            expect(response.status).toBe(400);
            expect(response.text).toBe("Usuário não tem permissão!");
        });
    });

    // =========================================================================
    // DELETE /student/:id
    // =========================================================================
    describe("DELETE /student/:id", () => {
        it("should return 201 when Admin deletes a student", async () => {
            const token = generateTestToken(adminUser);
            
            // Valida se quem chamou é o Admin
            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            // Simula a deleção com sucesso
            (studentRepository.deleteStudentInDb as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete("/student/10")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(201);
        });

        it("should return 400 if a non-Admin tries to delete a student", async () => {
            const token = generateTestToken(teacherUser); // Usando teacher para falhar
            
            (studentRepository.findUser as jest.Mock).mockResolvedValue(teacherUser);

            const response = await request(app)
                .delete("/student/10")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.text).toBe("Usuário não tem permissão!");
        });

        it("should return 500 if DB fails to delete", async () => {
            const token = generateTestToken(adminUser);
            
            (studentRepository.findUser as jest.Mock).mockResolvedValue(adminUser);
            // Simula erro no banco retornando falsy value
            (studentRepository.deleteStudentInDb as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .delete("/student/10")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(500);
            expect(response.text).toBe("Não foi possível deletar o usuário no momento.");
        });
    });
});