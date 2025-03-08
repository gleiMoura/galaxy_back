import prisma from "config";

export const findSpecificTeacher = async (id: number) => {
    try {
        return (
            await prisma.teacher.findUnique({
                where: {
                    id
                }
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const findAllTeachers = async () => {
    try {
        return (
            await prisma.teacher.findMany()
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const deleteTeacherFromDb = async (teacherId: number) => {
    try {
        return (
            await prisma.teacher.delete({
                where: {
                    id: teacherId
                }
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    };
};



