import request from "supertest";
import app from "../../src/app.js"; 
import jwt from "jsonwebtoken";
import * as classRepository from "../../src/repository/classRepository.js";
import * as studentRepository from "../../src/repository/studentRepository.js";
import * as fileService from "../../src/services/fileService.js";

jest.mock("../../src/repository/classRepository.js");
jest.mock("../../src/repository/studentRepository.js");
jest.mock("../../src/services/fileService.js");

jest.mock("../../src/config/index.js", () => ({
    __esModule: true,
    default: {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    },
}));

describe("Class Integration Tests", () => {
    const JWT_SECRET = process.env.JWT_SECRET || "sua_secret_aqui";

    const generateTestToken = (payload: object) => {
        return jwt.sign(payload, JWT_SECRET);
    };

    const teacherUser = { id: 1, email: "teacher@school.com", role: "Teacher" };
    const studentUser = { id: 2, email: "student@school.com", role: "Student" };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    // =========================================================================
    // POST /class
    // =========================================================================
    describe("POST /class", () => {
        it("should return 200 and create a class if user is a Teacher", async () => {
            const token = generateTestToken(teacherUser);
            
            (studentRepository.findUser as jest.Mock).mockResolvedValue(teacherUser);
            (fileService.createFileLink as jest.Mock).mockResolvedValue("http://cdn.com/lesson.pdf");
            (classRepository.createClassInDb as jest.Mock).mockResolvedValue({ id: 10, pdfUrl: "http://cdn.com/lesson.pdf" });

            const response = await request(app)
                .post("/class")
                .set("Authorization", `Bearer ${token}`)
                // Adicionando os campos exatos que o schema exige!
                .field("studentId", "5") 
                .field("teacherId", "1") 
                .field("title", "Math 101") 
                .field("subject", "Mathematics") 
                .attach("file", Buffer.from("conteúdo do pdf"), "lesson.pdf");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("pdfUrl", "http://cdn.com/lesson.pdf");
            expect(classRepository.createClassInDb).toHaveBeenCalled();
        });

        it("should return 400 if a Student tries to create a class", async () => {
            const token = generateTestToken(studentUser);
            
            (studentRepository.findUser as jest.Mock).mockResolvedValue(studentUser);

            const response = await request(app)
                .post("/class")
                .set("Authorization", `Bearer ${token}`)
                // Mesmo falhando por permissão, é boa prática mandar os campos corretos
                .field("studentId", "5")
                .field("teacherId", "1")
                .field("title", "Math 101")
                .field("subject", "Mathematics")
                .attach("file", Buffer.from("pdf fake"), "doc.pdf");

            expect(response.status).toBe(400);
            expect(response.text).toBe("Usuário não tem permissão!"); // Lendo de text
        });
    });

    // =========================================================================
    // GET /class/:id
    // =========================================================================
    describe("GET /class/:id", () => {
        it("should return 200 and the specific class", async () => {
            const mockClass = { id: 15, title: "History 101" };
            (classRepository.getClassById as jest.Mock).mockResolvedValue(mockClass);

            const response = await request(app).get("/class/15");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockClass);
        });

        it("should return 400 if class is not found", async () => {
            (classRepository.getClassById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/class/99");

            expect(response.status).toBe(400);
            expect(response.text).toBe("Não foi possível encontrar a lição no momento."); // Lendo de text
        });
    });

    // =========================================================================
    // GET /classes
    // =========================================================================
    describe("GET /classes", () => {
        it("should return 200 and classes for a Student", async () => {
            const token = generateTestToken(studentUser);
            const mockClasses = [{ id: 1, title: "Math" }];

            (classRepository.getClassesByStudentId as jest.Mock).mockResolvedValue(mockClasses);

            const response = await request(app)
                .get("/classes")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockClasses);
        });

        it("should return 200 and classes for a Teacher", async () => {
            const token = generateTestToken(teacherUser);
            const mockClasses = [{ id: 2, title: "Physics" }];

            (classRepository.getClassesByTeacherId as jest.Mock).mockResolvedValue(mockClasses);

            const response = await request(app)
                .get("/classes")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockClasses);
        });

        it("should return 400 if repository fails to fetch classes", async () => {
            const token = generateTestToken(teacherUser);
            
            (classRepository.getClassesByTeacherId as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/classes")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.text).toBe("Não foi possível encontrar as lições no momento!."); // Lendo de text
        });
    });
});