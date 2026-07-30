import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "interfaces";

export default async function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        status: "error",
        message: "Conflito: Um registro com estes dados já existe no sistema.",
      });
    }
  }

  console.error("Erro interno do servidor:", error);
  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor. Contate a administração do Galaxy.",
  });
}