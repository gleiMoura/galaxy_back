import { Request, Response, NextFunction } from "express";
import * as contractService from "../services/contractService";
import { AppError } from "../interfaces";

const requireAdmin = (userRole: string) => {
    if (userRole !== "admin") {
        throw new AppError("Acesso negado. Apenas administradores podem realizar esta ação.", 403);
    }
};

export async function createContract(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Presumindo que apenas administradores podem gerar contratos manualmente
        requireAdmin(res.locals.user.role);

        const contractData = req.body;

        const createdContract = await contractService.createContract(contractData);

        res.status(201).json({
            message: "Contrato criado com sucesso.",
            data: createdContract,
        });
    } catch (error) {
        next(error);
    }
}

export async function getContract(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const contractId = Number(req.params.id);
        
        // A lógica de quem pode ver o contrato (se o aluno dono do contrato, professor ou admin) 
        // deve ser tratada dentro do service para manter o controller limpo.
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;

        const contract = await contractService.getContractById(contractId, userId, userRole);

        res.status(200).json({
            data: contract,
        });
    } catch (error) {
        next(error);
    }
}

export async function getContracts(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Se for admin, busca todos. Se for aluno/professor, o service pode filtrar pelo ID do usuário
        const userId = res.locals.user.id;
        const userRole = res.locals.user.role;

        const contracts = await contractService.getContracts(userId, userRole);

        res.status(200).json({
            data: contracts,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateContract(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);

        const contractId = Number(req.params.id);
        const contractData = req.body;

        const updatedContract = await contractService.updateContract(contractId, contractData);

        res.status(200).json({
            message: "Contrato atualizado com sucesso.",
            data: updatedContract,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteContract(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        requireAdmin(res.locals.user.role);

        const contractId = Number(req.params.id);

        await contractService.deleteContract(contractId);

        // 204 No Content é o padrão ideal para deleções bem-sucedidas
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}