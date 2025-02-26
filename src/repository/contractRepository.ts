import prisma from "config";
import { ContractType } from "interfaces";

export const createContractInDb = async (data) => {
    try {
        return (
            await prisma.contract.create({
                data
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const getContractsInDb = async () => {
    try {
        return (
            await prisma.contract.findMany()
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const changeContractInDb = async (dataContract: ContractType) => {
    try {
        return (
            await prisma.contract.update({
                data: { ...dataContract },
                where: { id: dataContract.id }
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

