import prisma from "config"; // Ajuste o caminho de acordo com a sua configuração de banco
import { CreateContractInput, UpdateContractInput } from "../interfaces/index.js";

export async function create(data: CreateContractInput) {
    return await prisma.contract.create({
        data: {
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            lessonsPerWeek: data.lessonsPerWeek,
            usedLessons: data.usedLessons || 0,
            contractTotalLessons: data.contractTotalLessons,
            firstMonthLessons: data.firstMonthLessons,
            secondMonthLessons: data.secondMonthLessons,
            thirdMonthLessons: data.thirdMonthLessons,
            signed: data.signed || false,
            planId: data.planId,
            studentId: data.studentId,
            teacherId: data.teacherId,
        }
    });
}

export async function update(id: number, data: UpdateContractInput) {
    const updateData: any = { ...data };

    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);

    return await prisma.contract.update({
        where: { id },
        data: updateData
    });
}

export async function remove(id: number) {
    return await prisma.contract.delete({
        where: { id }
    });
}

export async function findById(id: number) {
    return await prisma.contract.findUnique({
        where: { id },
        include: {
            plan: true,
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
}

export async function findAll() {
    return await prisma.contract.findMany({
        include: {
            plan: true,
            student: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: {
            startDate: 'desc'
        }
    });
}

export async function findByStudentId(studentId: number) {
    return await prisma.contract.findMany({
        where: { studentId },
        include: {
            plan: true,
            teacher: {
                select: {
                    id: true,
                    name: true,
                    subject: true
                }
            }
        },
        orderBy: {
            startDate: 'desc'
        }
    });
}