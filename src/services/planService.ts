import { AppError } from "../interfaces/index.js";
import * as planRepository from "../repository/planRepository.js";

export interface PlanInput {
    name: string;
    description: string;
    price: number;
    lessonsPerWeek: number;
    totalLessons: number;
}

export async function createPlan(data: PlanInput) {
    // Evita duplicidade de planos com o mesmo nome exato
    const existingPlan = await planRepository.findByName(data.name);
    if (existingPlan) {
        throw new AppError("Já existe um plano cadastrado com este nome.", 409);
    }

    return await planRepository.create(data);
}

export async function getPlanById(id: number) {
    const plan = await planRepository.findById(id);
    if (!plan) {
        throw new AppError("Plano não encontrado.", 404);
    }
    return plan;
}

export async function getPlans() {
    return await planRepository.findAll();
}

export async function updatePlan(id: number, data: Partial<PlanInput>) {
    const plan = await planRepository.findById(id);
    if (!plan) {
        throw new AppError("Plano não encontrado.", 404);
    }

    // Se estiver tentando alterar o nome, verifica se não vai conflitar
    if (data.name && data.name !== plan.name) {
        const existingPlan = await planRepository.findByName(data.name);
        if (existingPlan) {
            throw new AppError("Já existe outro plano cadastrado com este nome.", 409);
        }
    }

    return await planRepository.update(id, data);
}

export async function deletePlan(id: number) {
    const plan = await planRepository.findById(id);
    if (!plan) {
        throw new AppError("Plano não encontrado.", 404);
    }

    return await planRepository.remove(id);
}