import { getStudent, getStudents, updateStudent, deleteStudent } from "../../src/controllers/studentController";
import * as studentService from "../../src/services/studentService";
import { Request, Response } from "express";

// Mock the service module
jest.mock("../../src/services/studentService")

describe("Student Controller Unit Tests", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject = {};

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            // Mocking status and send to allow chaining: res.send().status()
            send: jest.fn().mockImplementation((result) => {
                responseObject = result;
                return mockResponse;
            }),
            status: jest.fn().mockImplementation(() => mockResponse),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch a student by ID and return 201", async () => {
        mockRequest = {
            user: { id: 1, email: "test@unirio.br", role: "student" },
            params: { id: "123" },
        };
        const mockStudent = { id: 123, name: "John Doe" };
        (studentService.findStudent as jest.Mock).mockResolvedValue(mockStudent);

        await getStudent(mockRequest as Request, mockResponse as Response);

        expect(studentService.findStudent).toHaveBeenCalledWith(mockRequest.user, 123);
        expect(mockResponse.send).toHaveBeenCalledWith(mockStudent);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should throw an error with status 409 if the user role is not authorized', async () => {
        const req = {
            user: { role: 'student', id: 2 },
            params: { id: '1' }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        } as unknown as Response;

        const errorMock = {
            response: {
                status: 409,
                message: "Estudante não pode procurar um estudante."
            }
        };
        jest.spyOn(studentService, 'findStudent').mockRejectedValue(errorMock);

        await expect(getStudent(req, res)).rejects.toEqual(errorMock);

        expect(res.send).not.toHaveBeenCalled();
    });

    it('should return 201 and the user data when found', async () => {
        // ARRANGE
        const req = {
            user: { email: 'test@example.com' }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;

        const mockUser = { id: 1, name: 'John Doe', email: 'test@example.com' };

        (studentService.findStudents as jest.Mock).mockResolvedValue(mockUser);

        await getStudents(req, res);

        expect(studentService.findStudents).toHaveBeenCalledWith('test@example.com');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(mockUser);
    });

    it('should pass the error to the error handler (express-async-errors)', async () => {
        const req = {
            user: { email: 'error@example.com' }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;

        const errorMock = { response: { status: 400, message: "Usuário não possui permissão!" } };

        (studentService.findStudents as jest.Mock).mockRejectedValue(errorMock);

        await expect(getStudents(req, res)).rejects.toEqual(errorMock);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('should return 201 and updated student data on success', async () => {
        const req = {
            user: { email: 'student@example.com' },
            body: { name: 'New Name' }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;

        const mockUpdatedUser = { id: 1, name: 'New Name', email: 'student@example.com' };

        (studentService.updateUserStudent as jest.Mock).mockResolvedValue(mockUpdatedUser);

        await updateStudent(req, res);

        expect(studentService.updateUserStudent).toHaveBeenCalledWith('student@example.com', { name: 'New Name' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should throw 400 error if user is a Teacher (caught by errorHandler)', async () => {
        const req = {
            user: { email: 'teacher@example.com' },
            body: { name: 'Hack' }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;

        const errorMock = {
            response: { status: 400, message: "Usuário não tem permissão!" }
        };

        (studentService.updateUserStudent as jest.Mock).mockRejectedValue(errorMock);

        await expect(updateStudent(req, res)).rejects.toEqual(errorMock);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('should return 201 and deleted student data on success', async () => {
        // ARRANGE
        const req = {
            user: { email: 'admin@example.com' },
            params: { id: '123' }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;

        const mockDeletedUser = { id: 123, deleted: true };

        // Mock de sucesso
        (studentService.deleteUserStudent as jest.Mock).mockResolvedValue(mockDeletedUser);

        // ACT
        await deleteStudent(req, res);

        // ASSERT
        expect(studentService.deleteUserStudent).toHaveBeenCalledWith('admin@example.com', '123');
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(mockDeletedUser);
    });

    it('should throw 400 error if user is NOT Admin (caught by errorHandler)', async () => {
        // ARRANGE
        const req = {
            user: { email: 'student@example.com' }, // Não é admin
            params: { id: '123' }
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        } as unknown as Response;

        // Objeto de erro esperado
        const errorMock = {
            response: { status: 400, message: "Usuário não tem permissão!" }
        };

        // Mock de erro
        (studentService.deleteUserStudent as jest.Mock).mockRejectedValue(errorMock);

        // ACT & ASSERT
        await expect(deleteStudent(req, res)).rejects.toEqual(errorMock);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
