import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import dotenv from "dotenv";
import { AppError, CustomJwtPayload } from "interfaces";

dotenv.config();

const tokenValidator = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // 2. Transmite o erro de configuração para o middleware de erro do Express
        return next(new AppError("JWT_SECRET não está configurado nas variáveis de ambiente."));
    }

    try {
        const decoded = jwt.verify(token, secret) as CustomJwtPayload;
        req.user = decoded;
        return next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token expired. Please log in again." });
            return;
        }

        res.status(403).json({ message: "Invalid token.", detail: error.message });
        return;
    }
};

export default tokenValidator;