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
        return await prisma.contract.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileUrl: true,
                        schoolYear: true,
                    },
                },
                teacher: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileUrl: true,
                        subject: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error finding contracts:", error);
        return null;
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

