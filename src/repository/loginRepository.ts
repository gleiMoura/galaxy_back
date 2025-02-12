import prisma from "config";

const findUser = async (email) => {
    try {
        return (
            await prisma.student.findUnique({ where: { email } }) ||
            await prisma.teacher.findUnique({ where: { email } })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export {
    findUser
}