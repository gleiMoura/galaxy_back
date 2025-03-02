import { Request, Response } from "express";
import { generateFileLink } from "../repository/filesRepository.js";
import { logUser, logUserWithProfileLink } from "../services/registerService.js";


export const doRegister = async (req: Request, res: Response) => {
    const credentials = req.body;

    await logUser(credentials);

    res.sendStatus(201);
};


export const insertProfileImage = async (req: Request, res: Response) => {
    const file = req.file;
    const userEmail = req.user?.email;

    const fileLink = await generateFileLink(file);

    const profile = await logUserWithProfileLink(userEmail, fileLink);

    res.status(201).send(profile);
};