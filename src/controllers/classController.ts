import { generateFileLink } from "repository/filesRepository";
import { Request, Response } from "express";
import { generateClass } from "services/classService";

export const createClass = async (req: Request, res: Response) => {
    const file = req.file;
    const data = req.body.data;
    const userEmail = req.user?.email;

    const fileUrl = await generateFileLink(file);
    const newData = { ...data, fileUrl }
    const newClass = await generateClass(userEmail, newData);

    res.status(200).send(newClass);
};
