import { Request, Response } from "express";
import { createClass, getClass, getClasses } from "../../src/controllers/classController"; // Ajuste o caminho
import * as classService from "../../src/services/classService"; 
import * as fileService from "../../src/services/fileService";

jest.mock("../../src/services/classService");
jest.mock("../../src/services/fileService");


describe("Class Controllers", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Configuração padrão do Request e Response
        req = {
            params: {},
            body: {},
            user: { id: 1, email: "teacher@school.com", role: "Teacher" },
            file: { originalname: "test.pdf" } as Express.Multer.File // Mock simples do arquivo
        };

        res = {
            status: jest.fn().mockReturnThis(), // Permite encadeamento .status().send()
            send: jest.fn().mockReturnThis()
        };
    });

    // ------------------------------------------------------------------
    // 1. Testes para createClass
    // ------------------------------------------------------------------
    describe("createClass", () => {
        it("should return 200 and the created class", async () => {
            // ARRANGE
            req.body = { title: "Math Class", studentId: "5" };

            const mockUrl = "https://bucket.aws.com/file.pdf";
            const mockCreatedClass = { id: 10, title: "Math Class", pdfUrl: mockUrl };

            // Mock do serviço de arquivo
            (fileService.createFileLink as jest.Mock).mockResolvedValue(mockUrl);

            // Mock do serviço de criação de aula
            (classService.generateClass as jest.Mock).mockResolvedValue(mockCreatedClass);

            // ACT
            await createClass(req as Request, res as Response);

            // ASSERT
            // 1. Verifica se o link do arquivo foi gerado
            expect(fileService.createFileLink).toHaveBeenCalledWith(req.file);

            // 2. Verifica se a classe foi gerada com o email, body e url corretos
            expect(classService.generateClass).toHaveBeenCalledWith(
                "teacher@school.com",
                req.body,
                mockUrl
            );

            // 3. Verifica resposta HTTP
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockCreatedClass);
        });

        it("should bubble up error if generateClass fails (e.g. permission denied)", async () => {
            // ARRANGE
            req.body = { title: "Math Class" };

            // Simulamos que o link foi criado, mas a validação de usuário falhou depois
            (fileService.createFileLink as jest.Mock).mockResolvedValue("http://url.com");

            const errorMock = {
                response: { status: 400, message: "Usuário não tem permissão!" }
            };
            (classService.generateClass as jest.Mock).mockRejectedValue(errorMock);

            // ACT & ASSERT
            await expect(createClass(req as Request, res as Response)).rejects.toEqual(errorMock);
            expect(res.status).not.toHaveBeenCalled(); // Não deve enviar sucesso
        });
    });

    // ------------------------------------------------------------------
    // 2. Testes para getClass
    // ------------------------------------------------------------------
    describe("getClass", () => {
        it("should return 200 and the specific class", async () => {
            // ARRANGE
            req.params = { id: "50" };
            const mockClass = { id: 50, title: "History Lesson" };

            (classService.getSpecificClass as jest.Mock).mockResolvedValue(mockClass);

            // ACT
            await getClass(req as Request, res as Response);

            // ASSERT
            expect(classService.getSpecificClass).toHaveBeenCalledWith("50");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockClass);
        });

        it("should bubble up error if class is not found (400 or 404)", async () => {
            // ARRANGE
            req.params = { id: "999" };
            const errorMock = {
                response: { status: 400, message: "Não foi possível encontrar a lição no momento." }
            };

            (classService.getSpecificClass as jest.Mock).mockRejectedValue(errorMock);

            // ACT & ASSERT
            await expect(getClass(req as Request, res as Response)).rejects.toEqual(errorMock);
        });
    });

    // ------------------------------------------------------------------
    // 3. Testes para getClasses
    // ------------------------------------------------------------------
    describe("getClasses", () => {
        it("should return 200 and the list of classes for the user", async () => {
            // ARRANGE
            req.user = { id: 2, role: "Teacher", email: "teach@test.com" };
            const mockList = [{ id: 1, title: "Aula 1" }, { id: 2, title: "Aula 2" }];

            (classService.getAllClasses as jest.Mock).mockResolvedValue(mockList);

            // ACT
            await getClasses(req as Request, res as Response);

            // ASSERT
            expect(classService.getAllClasses).toHaveBeenCalledWith(req.user);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockList);
        });

        it("should bubble up error if fetching classes fails", async () => {
            // ARRANGE
            const errorMock = {
                response: { status: 400, message: "Não foi possível encontrar as lições no momento!." }
            };

            (classService.getAllClasses as jest.Mock).mockRejectedValue(errorMock);

            // ACT & ASSERT
            await expect(getClasses(req as Request, res as Response)).rejects.toEqual(errorMock);
            expect(res.send).not.toHaveBeenCalled();
        });
    });
});