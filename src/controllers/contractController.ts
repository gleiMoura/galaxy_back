
import { Request, Response } from "express";
import { ContractType } from "interfaces";
import { changeContract, getAllContracts, makeContract } from "services/contractService";

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

export const updateContract = async (req: Request, res: Response) => {
    const adminEmail = req.user?.email;
    const dataContract: ContractType = req.body;

    const contract = await changeContract(adminEmail, dataContract)

    res.send(contract).status(200);
};

