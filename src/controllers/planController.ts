import { Request, Response, NextFunction } from "express";
import * as planService from "../services/planService.js";
import { AppError } from "../interfaces/index.js"; // Ajuste o caminho se necessário

const requireAdmin = (userRole: string) => {
    if (userRole !== "admin") {
        throw new AppError("Acesso negado. Apenas administradores podem realizar esta ação.", 403);
    }
};

export async function createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);
        const planData = req.body;
        const createdPlan = await planService.createPlan(planData);

        res.status(201).json({
            message: "Plano criado com sucesso.",
            data: createdPlan,
        });
    } catch (error) {
        next(error);
    }
}

export async function getPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const planId = Number(req.params.id);
        const plan = await planService.getPlanById(planId);

        res.status(200).json({ data: plan });
    } catch (error) {
        next(error);
    }
}

export async function getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const plans = await planService.getPlans();
        res.status(200).json({ data: plans });
    } catch (error) {
        next(error);
    }
}

export async function updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);
        const planId = Number(req.params.id);
        const planData = req.body;

        const updatedPlan = await planService.updatePlan(planId, planData);

        res.status(200).json({
            message: "Plano atualizado com sucesso.",
            data: updatedPlan,
        });
    } catch (error) {
        next(error);
    }
}

export async function deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);
        const planId = Number(req.params.id);

        await planService.deletePlan(planId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}