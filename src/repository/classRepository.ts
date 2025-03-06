import prisma from "config";

export const createClassInDb = async (data: any) => {
    try {
        return (
            await prisma.class.create({
                data: {
                    title: data.title,
                    subject: data.subject,
                    student: {
                        connect: { id: parseInt(data.studentId) }
                    },
                    teacher: {
                        connect: { id: parseInt(data.teacherId) }
                    },
                    sentAt: data.sentAt,
                    pdfUrl: data.pdfUrl
                }
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

export const getClassById = async (id: number) => {
    try {
        const classData = await prisma.class.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                subject: true,
                student: {
                    select: {
                        name: true
                    }
                },
                teacher: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!classData) {
            console.log("It's not possible find this Lesson.")
        };

        return classData;
    } catch (error) {
        console.error("Error getting class", error);
    }
};