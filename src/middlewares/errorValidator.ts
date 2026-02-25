import { Request, Response, NextFunction } from "express";
import { CustomError } from "interfaces/index.js"; // Ajuste o caminho se necessário

async function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    const customErr = error as CustomError;

    if (customErr.response) {
        res.status(customErr.response.status).send(customErr.response.message);
    } else {
        console.error("Erro interno:", error); 
        res.sendStatus(500);
    }
};

export default errorHandler;