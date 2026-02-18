import { Request, Response } from "express";
import { studentType } from "interfaces";
import { deleteUserStudent, findStudent, findStudents, updateUserStudent } from "../../src/services/studentService";

export const getStudent = async (req: Request, res: Response) => {
    const user = req.user;
    const studentId = parseInt(req.params?.id);

    const student = await findStudent(user, studentId)

    res.status(201).send(student);
};

export const getStudents = async (req: Request, res: Response) => {
    const email = req.user?.email;

    const user = await findStudents(email)

    res.status(201).send(user);
};

export const updateStudent = async (req: Request, res: Response) => {
    const email = req.user?.email;
    const updateData: studentType = req.body;

    const user = await updateUserStudent(email, updateData)

    res.status(201).send(user);
};

export const deleteStudent = async (req: Request, res: Response) => {
    const adminEmail = req.user?.email;
    const studentId = req.params.id;

    const user = await deleteUserStudent(adminEmail, studentId);

    res.status(201).send(user);
};