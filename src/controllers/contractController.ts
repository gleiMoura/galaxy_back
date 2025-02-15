
import { Request, Response } from "express";
import { makeContract } from "services/contractService";

export const createContract = async (req: Request, res: Response) => {
    const userEmail = req.user?.email;
    const data = req.body;

    await makeContract(userEmail, data)

    res.sendStatus(201);
}