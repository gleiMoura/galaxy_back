import { Request, Response } from "express";
import { generateClass, getAllClasses, getSpecificClass } from "../services/classService";
import { FileService } from "../services/fileService"; 

export const createClass = async (req: Request, res: Response) => {
    const file = req.file;
    const userEmail = req.user?.email;
    const data = req.body;

    const fileUrl = await FileService.createPublicFileLink(file);
    const newClass = await generateClass(userEmail, data, fileUrl);

    res.status(200).send(newClass);
};

export const getClass = async (req: Request, res: Response) => {
    const id = req.params?.id;

    const specificClass = await getSpecificClass(id);

    res.status(200).send(specificClass);
};

export const getClasses = async (req: Request, res: Response) => {
    const user = req.user;

    const classes = await getAllClasses(user);

    res.status(200).send(classes);
};
