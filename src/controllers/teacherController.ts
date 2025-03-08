
import { Request, Response } from "express";
import { deleteSpecificTeacher, findTeacher, findTeachers } from "services/teacherService";

export const getTeacher = async (req: Request, res: Response) => {
    const user = req.user;
    const teacherId = parseInt(req.params?.id);

    const teacher = await findTeacher(user, teacherId)

    res.send(teacher).status(201);
};

export const getTeachers = async (req: Request, res: Response) => {
    const user = req.user;

    const teacher = await findTeachers(user)

    res.send(teacher).status(201);
};

export const deleteTeacher = async (req: Request, res: Response) => {
    const user = req.user;
    const teacherId = parseInt(req.params?.id);

    await deleteSpecificTeacher(user, teacherId)

    res.send("Deleted!").status(201);
};