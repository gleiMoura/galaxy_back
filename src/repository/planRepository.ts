import prisma from "config";
import { PlanInput } from "../services/planService.js";

export async function create(data: PlanInput) {
    return await prisma.plan.create({
        data
    });
}

export async function findById(id: number) {
    return await prisma.plan.findUnique({
        where: { id }
    });
}

export async function findByName(name: string) {
    return await prisma.plan.findFirst({
        where: { name }
    });
}

export async function findAll() {
    return await prisma.plan.findMany({
        orderBy: {
            price: 'asc' // Lista os planos do mais barato para o mais caro
        }
    });
}

export async function update(id: number, data: Partial<PlanInput>) {
    return await prisma.plan.update({
        where: { id },
        data
    });
}

export async function remove(id: number) {
    return await prisma.plan.delete({
        where: { id }
    });
}