
import { Request, Response } from "express";
import { getAllContracts, makeContract } from "services/contractService";

export const createContract = async (req: Request, res: Response) => {
    const userEmail = req.user?.email;
    const data = req.body;

    await makeContract(userEmail, data)

    res.sendStatus(201);
};

export const getContracts = async (req: Request, res: Response) => {
    const adminEmail = req.user?.email;

    const contracts = await getAllContracts(adminEmail)

    res.send(contracts).status(200);
};