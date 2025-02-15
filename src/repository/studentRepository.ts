import prisma from "config";

export const findUser = async (email) => {
    try {
        return (
            await prisma.student.findUnique({ where: { email } }) ||
            await prisma.teacher.findUnique({ where: { email } })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const findAllStudents = async () => {
    try {
        return (
            await prisma.student.findMany()
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const updateStudentInDB = async (userId: number, updateData) => {
    try {
        return (
            await prisma.student.update({
                where: { id: userId },
                data: { ...updateData }
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const deleteStudentInDb = async (userId: number) => {
    try {
        return (
            await prisma.student.delete({
                where: { id: userId }
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

