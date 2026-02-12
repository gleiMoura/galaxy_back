import { Request, Response } from "express";
import { signinUser } from "../services/loginService";

export const doLogin = async (req: Request, res: Response) => {
    const credentials = req.body;

    const userInformation = await signinUser(credentials);

    res.status(201).send(userInformation)
}