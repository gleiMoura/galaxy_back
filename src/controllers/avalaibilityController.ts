import { Request, Response, NextFunction } from "express";
import * as availabilityService from "../services/availabilityService";
import { AppError } from "../interfaces";

const requireAdmin = (userRole: string) => {
    if (userRole !== "admin") {
        throw new AppError("Acesso negado. Apenas administradores podem realizar esta ação.", 403);
    }
};

export async function submitInitialAvailability(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const teacherId = res.locals.user.id;
        const { availabilities } = req.body;

        const createdAvailabilities =
            await availabilityService.submitInitialAvailability(
                teacherId,
                availabilities
            );

        res.status(201).json({
            message: "Grade inicial cadastrada com sucesso.",
            data: createdAvailabilities,
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyAvailabilities(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const teacherId = res.locals.user.id;

        const availabilities =
            await availabilityService.getTeacherAvailabilities(teacherId);

        res.status(200).json({
            data: availabilities,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateFullAvailability(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);

        const teacherId = Number(req.params.teacherId);
        const { availabilities } = req.body;

        const updatedAvailabilities =
            await availabilityService.updateFullAvailabilityByAdmin(
                teacherId,
                availabilities
            );

        res.status(200).json({
            message: "Grade de disponibilidade atualizada com sucesso pelo administrador.",
            data: updatedAvailabilities,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateSingleAvailability(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);

        const availabilityId = Number(req.params.id);
        const availabilityData = req.body;

        const updatedItem = await availabilityService.updateSingleAvailabilityByAdmin(
            availabilityId,
            availabilityData
        );

        res.status(200).json({
            message: "Horário de disponibilidade atualizado com sucesso pelo administrador.",
            data: updatedItem,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteSingleAvailability(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);

        const availabilityId = Number(req.params.id);

        await availabilityService.deleteSingleAvailabilityByAdmin(availabilityId);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getTeacherAvailabilities(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const teacherId = Number(req.params.teacherId);

        const availabilities =
            await availabilityService.getTeacherAvailabilities(teacherId);

        res.status(200).json({
            data: availabilities,
        });
    } catch (error) {
        next(error);
    }
}