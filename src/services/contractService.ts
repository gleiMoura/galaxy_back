import { AppError } from "../interfaces";
import * as contractRepository from "../repository/contractRepository";
import { CreateContractInput, UpdateContractInput } from "../interfaces";

const calculateMonthDifference = (startDate: Date, endDate: Date): number => {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
};

const validateContractDuration = (startDateStr: string | Date, endDateStr: string | Date) => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (start >= end) {
        throw new AppError("A data de término deve ser posterior à data de início.", 400);
    }

    const diffInMonths = calculateMonthDifference(start, end);

    // Regra de negócio: Contratos duram 3, 6 ou 12 meses
    const validDurations = [3, 6, 12];
    if (!validDurations.includes(diffInMonths)) {
        throw new AppError(
            `Duração de contrato inválida. O contrato tem duração calculada de ${diffInMonths} meses, mas só são permitidos contratos de 3, 6 ou 12 meses.`,
            400
        );
    }
};


export async function createContract(data: CreateContractInput) {
    validateContractDuration(data.startDate, data.endDate);
    
    return await contractRepository.create(data);
}

export async function updateContract(contractId: number, data: UpdateContractInput) {
    const existingContract = await contractRepository.findById(contractId);

    if (!existingContract) {
        throw new AppError("Contrato não encontrado.", 404);
    }

    const newStartDate = data.startDate || existingContract.startDate;
    const newEndDate = data.endDate || existingContract.endDate;
    
    if (data.startDate || data.endDate) {
        validateContractDuration(newStartDate, newEndDate);
    }

    return await contractRepository.update(contractId, data);
}

export async function deleteContract(contractId: number) {
    const existingContract = await contractRepository.findById(contractId);

    if (!existingContract) {
        throw new AppError("Contrato não encontrado.", 404);
    }

    return await contractRepository.remove(contractId);
}

export async function getContractById(contractId: number, userId: number, userRole: string) {
    // Bloqueio imediato para professores
    if (userRole === "teacher") {
        throw new AppError("Acesso negado. Professores não têm permissão para visualizar contratos.", 403);
    }

    const contract = await contractRepository.findById(contractId);

    if (!contract) {
        throw new AppError("Contrato não encontrado.", 404);
    }

    // Regra de isolamento de dados: Alunos só veem contratos vinculados a eles
    if (userRole === "student" && contract.studentId !== userId) {
        throw new AppError("Acesso negado. Este contrato não pertence a você.", 403);
    }

    return contract;
}

export async function getContracts(userId: number, userRole: string) {
    // Bloqueio explícito para professores
    if (userRole === "teacher") {
        throw new AppError("Acesso negado. Professores não têm permissão para visualizar contratos.", 403);
    }

    // Admin vê todos os contratos. 
    if (userRole === "admin") {
        return await contractRepository.findAll();
    }

    // Aluno vê os seus próprios contratos.
    if (userRole === "student") {
        return await contractRepository.findByStudentId(userId);
    }

    throw new AppError("Perfil de usuário inválido para busca de contratos.", 403);
}