import prisma from "config";
import { teacherRegisterType } from "interfaces";


export const createTeacherInDb = async (data: teacherRegisterType) => {
    return await prisma.teacher.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            cpf: data.cpf,
            phone: data.phone,
            subject: data.subject, // <--- CAMPO OBRIGATÓRIO ADICIONADO
            academicDegree: data.academicDegree ?? null,
            funFactOne: data.funFactOne ?? null,
            funFactTwo: data.funFactTwo ?? null,
            profileUrl: data.profileUrl ?? "https://storage.googleapis.com/galaxy-bucket/default-avatar.png",
        },
    });
};


export const findTeacherByEmailOrCpf = async (email: string, cpf: string) => {
  return await prisma.teacher.findFirst({
    where: {
      OR: [
        { email: email },
        { cpf: cpf }
      ]
    },
    select: { email: true, cpf: true }
  });
};

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



