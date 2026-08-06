import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AvailabilityInput {
    weekday: number;
    startTime: string;
    endTime: string;
    isExtraHour?: boolean;
}

export async function createMany(
    teacherId: number,
    availabilities: AvailabilityInput[]
) {
    return await prisma.availability.createMany({
        data: availabilities.map((slot) => ({
            ...slot,
            teacherId,
        })),
    });
}

export async function replaceTeacherAvailabilities(
    teacherId: number,
    availabilities: AvailabilityInput[]
) {
    return await prisma.$transaction(async (tx) => {
        await tx.availability.deleteMany({
            where: { teacherId },
        });

        await tx.availability.createMany({
            data: availabilities.map((slot) => ({
                ...slot,
                teacherId,
            })),
        });

        return await tx.availability.findMany({
            where: { teacherId },
            orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
        });
    });
}

export async function findById(id: number) {
    return await prisma.availability.findUnique({
        where: { id },
    });
}

export async function findByTeacherId(teacherId: number) {
    return await prisma.availability.findMany({
        where: { teacherId },
        orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
    });
}

export async function update(id: number, data: AvailabilityInput) {
    return await prisma.availability.update({
        where: { id },
        data: {
            ...data,
            requestedAt: new Date(), 
        },
    });
}

export async function remove(id: number) {
    return await prisma.availability.delete({
        where: { id },
    });
}