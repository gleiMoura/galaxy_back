import { Request, Response } from "express";
import { createNewPayment } from "services/paymentService";

export const createPayment = async (req: Request, res: Response) => {
    const data = req.body;
    const user = req.user;

    await createNewPayment(user, data);

    res.status(200).send("Created!");
};