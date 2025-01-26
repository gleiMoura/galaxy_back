import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import { ValidationErrorItem } from "joi";

export default function schemaValidator(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            console.log(chalk.red("Erro de validação:", error.details));

            res.status(410).json({
                status: 410,
                errors: error.details.map((detail: ValidationErrorItem) => detail.message)
            })

            return
        }

        next();
    }
}