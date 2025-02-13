import { Request, Response } from "express";
import { findStudent, findStudents } from "services/studentService.js";

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