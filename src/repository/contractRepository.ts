import prisma from "config";

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

