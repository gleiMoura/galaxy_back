import { Request, Response } from "express";
import { getTeacher, getTeachers, deleteTeacher } from "../../src/controllers/teacherController"; // Ajuste o caminho
import * as teacherService from "../../src/services/teacherService"; // Ajuste o caminho
import { TeacherType, CustomError } from "../../src/interfaces"; // Ajuste o caminho das types

// Mock do Service inteiro
jest.mock("../../src/services/teacherService");

describe("Teacher Controllers", () => {

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {},
            user: {
                id: 1,
                role: "Admin",
                email: "admin@school.com"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });

    describe("getTeacher", () => {
        it("should return 201 and the teacher data (TeacherType) on success", async () => {
            req.params = { id: "10" };

            const mockTeacher: TeacherType = {
                id: 10,
                name: "Mr. Smith",
                subject: "Mathematics",
                email: "smith@school.com",
                profileUrl: "http://image.com/smith.jpg"
            };

            (teacherService.findTeacher as jest.Mock).mockResolvedValue(mockTeacher);

            await getTeacher(req as Request, res as Response);

            expect(teacherService.findTeacher).toHaveBeenCalledWith(req.user, 10);
            expect(res.send).toHaveBeenCalledWith(mockTeacher);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it("should bubble up CustomError (e.g., 409) to the errorHandler", async () => {
            req.params = { id: "10" };
            req.user = { id: 50, role: "Student", email: "student@school.com" };

            const errorMock: Partial<CustomError> = {
                response: {
                    status: 409,
                    message: "Estudante não pode procurar por um professor."
                }
            };

            (teacherService.findTeacher as jest.Mock).mockRejectedValue(errorMock);

            await expect(getTeacher(req as Request, res as Response)).rejects.toEqual(errorMock);
            expect(res.send).not.toHaveBeenCalled();
        });
    });

    describe("getTeachers", () => {
        it("should return 201 and list of teachers (TeacherType[]) on success", async () => {
            req.user = { id: 1, role: "Admin", email: "admin@school.com" };

            const mockList: TeacherType[] = [
                { id: 1, name: "Teacher A", subject: "History", email: "a@school.com" },
                { id: 2, name: "Teacher B", subject: "Physics", email: "b@school.com" }
            ];

            (teacherService.findTeachers as jest.Mock).mockResolvedValue(mockList);

            await getTeachers(req as Request, res as Response);

            expect(teacherService.findTeachers).toHaveBeenCalledWith(req.user);
            expect(res.send).toHaveBeenCalledWith(mockList);
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it("should bubble up error if user is unauthorized", async () => {
            req.user = { id: 50, role: "Student", email: "student@school.com" };

            const errorMock: Partial<CustomError> = {
                response: { status: 409, message: "Estudante não pode procurar por professores!" }
            };

            (teacherService.findTeachers as jest.Mock).mockRejectedValue(errorMock);

            await expect(getTeachers(req as Request, res as Response)).rejects.toEqual(errorMock);
        });
    });

    describe("deleteTeacher", () => {
        it("should return 201 and success message", async () => {
            req.params = { id: "5" };
            req.user = { id: 1, role: "Admin", email: "admin@school.com" };

            (teacherService.deleteSpecificTeacher as jest.Mock).mockResolvedValue(undefined);

            await deleteTeacher(req as Request, res as Response);

            expect(teacherService.deleteSpecificTeacher).toHaveBeenCalledWith(req.user, 5);
            expect(res.send).toHaveBeenCalledWith("Deleted!");
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it("should bubble up error if service fails", async () => {
            req.params = { id: "5" };
            req.user = { id: 50, role: "Student", email: "student@school.com" };

            const errorMock: Partial<CustomError> = {
                response: { status: 409, message: "Estudante não pode procurar por professores!" }
            };

            (teacherService.deleteSpecificTeacher as jest.Mock).mockRejectedValue(errorMock);

            await expect(deleteTeacher(req as Request, res as Response)).rejects.toEqual(errorMock);
            expect(res.send).not.toHaveBeenCalled();
        });
    });
});