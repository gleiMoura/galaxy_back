import { Request, Response } from "express";
import { QuizzType } from "../interfaces/index.js";
import { getAllQuizzes, createQuizz, getUserQuizzes, deleteQuizzById, takeQuizzById } from "../services/quizzService.js";

export const doQuizz = async (req: Request, res: Response) => {
    const quizz: QuizzType = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const createdQuizz: QuizzType = await createQuizz(quizz, token);

    res.send(createdQuizz).status(201);
};

export const sendAllQuizzes = async (req: Request, res: Response) => {
    const allQuizzes = await getAllQuizzes();

    res.send(allQuizzes).status(201);
};

export const sendUserQuizzes = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    const userQuizzes = await getUserQuizzes(token);

    res.send(userQuizzes).status(201);
};

export const deleteQuizz = async (req: Request, res: Response) => {
    const id = req.params.id;

    await deleteQuizzById(id);

    res.status(200).send("Quizz was deleted successfully");
};

export const getQuizzById = async (req: Request, res: Response) => {
    const id = req.params.id;
    
    const quizz = await takeQuizzById(id);

    res.status(200).send(quizz);
};

