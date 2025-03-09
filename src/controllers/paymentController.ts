import { Request, Response } from "express";
import { createNewPayment, findPayment, findPayments } from "services/paymentService";

export const createPayment = async (req: Request, res: Response) => {
    const data = req.body;
    const user = req.user;

    await createNewPayment(user, data);

    res.status(200).send("Created!");
};

export const getPayment = async (req: Request, res: Response) => {
    const paymentId = req.params?.id;
    const user = req.user;

    const payment = await findPayment(user, paymentId);

    res.status(200).send(payment);
};

export const getPayments = async (req: Request, res: Response) => {
    const user = req.user;

    const payment = await findPayments(user);

    res.status(200).send(payment);
};