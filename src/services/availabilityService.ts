import { AppError } from "../interfaces";
import * as availabilityRepository from "../repository/availabilityRepository";

interface AvailabilityInput {
    weekday: number;
    startTime: string;
    endTime: string;
    isExtraHour?: boolean;
}

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const checkOverlaps = (availabilities: AvailabilityInput[]) => {
    const groupedByDay: Record<number, AvailabilityInput[]> = {};

    availabilities.forEach((slot) => {
        if (!groupedByDay[slot.weekday]) groupedByDay[slot.weekday] = [];
        groupedByDay[slot.weekday].push(slot);
    });

    for (const day in groupedByDay) {
        const slots = groupedByDay[day].sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );

        for (let i = 0; i < slots.length - 1; i++) {
            const currentEnd = timeToMinutes(slots[i].endTime);
            const nextStart = timeToMinutes(slots[i + 1].startTime);

            if (currentEnd > nextStart) {
                // Correção: uso de crases (template literals) para a interpolação funcionar
                throw new AppError(
                    `Conflito de horários detectado no dia da semana ${day}: ${slots[i].startTime}-${slots[i].endTime} e ${slots[i + 1].startTime}-${slots[i + 1].endTime}.`,
                    400
                );
            }
        }
    }
};

// ==========================================
// TEACHER ACTIONS
// ==========================================

export async function submitInitialAvailability(
    teacherId: number,
    availabilities: AvailabilityInput[]
) {
    const existingAvailabilities = await availabilityRepository.findByTeacherId(teacherId);
    
    if (existingAvailabilities.length > 0) {
        throw new AppError(
            "Você já enviou sua grade de horários inicial. Alterações agora só podem ser feitas pela coordenação.", 
            403
        );
    }

    checkOverlaps(availabilities);

    return await availabilityRepository.createMany(teacherId, availabilities);
}

export async function getTeacherAvailabilities(teacherId: number) {
    return await availabilityRepository.findByTeacherId(teacherId);
}

// ==========================================
// AÇÕES EXCLUSIVAS DO ADMIN
// ==========================================

export async function updateFullAvailabilityByAdmin(
    teacherId: number,
    availabilities: AvailabilityInput[]
) {
    checkOverlaps(availabilities);
    
    return await availabilityRepository.replaceTeacherAvailabilities(
        teacherId,
        availabilities
    );
}

export async function updateSingleAvailabilityByAdmin(
    availabilityId: number,
    data: AvailabilityInput
) {
    const existingSlot = await availabilityRepository.findById(availabilityId);

    if (!existingSlot) {
        throw new AppError("Horário de disponibilidade não encontrado.", 404);
    }

    // Validação robusta de choque de horários para a edição pontual
    const currentAvailabilities = await availabilityRepository.findByTeacherId(
        existingSlot.teacherId
    );
    
    const otherAvailabilities = currentAvailabilities.filter(
        (slot) => slot.id !== availabilityId
    );
    
    const simulatedFutureGrid = [...otherAvailabilities, data];

    checkOverlaps(simulatedFutureGrid);

    return await availabilityRepository.update(availabilityId, data);
}

export async function deleteSingleAvailabilityByAdmin(
    availabilityId: number
) {
    const existingSlot = await availabilityRepository.findById(availabilityId);

    if (!existingSlot) {
        throw new AppError("Horário de disponibilidade não encontrado.", 404);
    }

    return await availabilityRepository.remove(availabilityId);
}