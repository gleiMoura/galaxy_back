import { Request, Response } from "express";
import { studentType } from "interfaces";
import { deleteUserStudent, findStudent, findStudents, updateUserStudent } from "services/studentService.js";

export const getStudent = async (req: Request, res: Response) => {
    const email = req.user?.email;

    const user = await findStudent(email)

    res.send(user).status(201);
};

export const getStudents = async (req: Request, res: Response) => {
    const email = req.user?.email;

    const user = await findStudents(email)

    res.send(user).status(201);
};

export const updateStudent = async (req: Request, res: Response) => {
    const email = req.user?.email;
    const updateData: studentType = req.body;

    const user = await updateUserStudent(email, updateData)

    res.send(user).status(201);
};

export const deleteStudent = async (req: Request, res: Response) => {
    const adminEmail = req.user?.email;
    const studentId = req.params.id;

    const user = await deleteUserStudent(adminEmail, studentId);

    res.send(user).status(201);
};