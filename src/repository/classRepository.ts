import prisma from "config";

export const createClassInDb = async (data) => {
    try {
        return (
            await prisma.class.create({
                data
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};