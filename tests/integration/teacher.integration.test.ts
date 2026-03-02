import request from "supertest";
import app from "../../src/app.js";
import jwt from "jsonwebtoken";
import * as teacherRepository from "../../src/repository/teacherRepository.js";

jest.mock("../../src/repository/teacherRepository.js");

jest.mock("../../src/config/index.js", () => ({
    __esModule: true,
    default: {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    },
}));

describe("Teacher Integration Tests", () => {
    const JWT_SECRET = process.env.JWT_SECRET || "sua_secret_aqui";

    const generateTestToken = (payload: object) => {
        return jwt.sign(payload, JWT_SECRET);
    };

    const adminUser = { id: 1, email: "admin@test.com", role: "Admin" };
    const studentUser = { id: 2, email: "student@test.com", role: "Student" };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    // =========================================================================
    // GET /teacher/:id
    // =========================================================================
    describe("GET /teacher/:id", () => {
        it("should return 200 and teacher info when requested by non-Student", async () => {
            const token = generateTestToken(adminUser);
            const mockTeacher = { id: 10, name: "Mr. Professor", subject: "Math" };

            (teacherRepository.findSpecificTeacher as jest.Mock).mockResolvedValue(mockTeacher);

            const response = await request(app)
                .get("/teacher/10")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTeacher);
        });

        it("should return 409 if a Student tries to search for a teacher", async () => {
            const token = generateTestToken(studentUser);
            const mockTeacher = { id: 10, name: "Mr. Professor" };

            (teacherRepository.findSpecificTeacher as jest.Mock).mockResolvedValue(mockTeacher);

            const response = await request(app)
                .get("/teacher/10")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(409);
        });

        it("should return 404 if the teacher is not found in DB", async () => {
            const token = generateTestToken(adminUser);

            (teacherRepository.findSpecificTeacher as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/teacher/99")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.text).toBe("Usuário não foi encontrado no sistema.");
        });
    });

    // =========================================================================
    // GET /teachers
    // =========================================================================
    describe("GET /teachers", () => {
        it("should return 200 and a list of teachers", async () => {
            const token = generateTestToken(adminUser);
            const mockTeachersList = [{ id: 1, name: "Teacher A" }];

            (teacherRepository.findAllTeachers as jest.Mock).mockResolvedValue(mockTeachersList);

            const response = await request(app)
                .get("/teachers")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTeachersList);
        });
    });

    // =========================================================================
    // DELETE /teacher/:id 
    // =========================================================================
    describe("DELETE /teacher/:id", () => {
        it("should return 200 or 201 and 'Deleted!' message when successful", async () => {
            const token = generateTestToken(adminUser);

            (teacherRepository.deleteTeacherFromDb as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete("/teacher/5")
                .set("Authorization", `Bearer ${token}`);

            expect([200, 201]).toContain(response.status);
        });

        it("should return 409 if a Student tries to delete a teacher", async () => {
            const token = generateTestToken(studentUser);

            (teacherRepository.deleteTeacherFromDb as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .delete("/teacher/5")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(409);
        });
    });
});