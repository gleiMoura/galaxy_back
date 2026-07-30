import prisma from "config";
import { studentRegisterType } from "../interfaces";

export const findStudentByEmail = async (email: string) => {
  try {
    return await prisma.student.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Erro em findStudentByEmail:", error);
    throw { type: "database_error", message: "Falha ao buscar estudante no banco de dados." };
  }
};

export const createStudentInDb = async (studentData: studentRegisterType) => {
  try {
    return await prisma.student.create({
      data: {
        name: studentData.name,
        guardianName: studentData.guardianName,
        phone: studentData.phone,
        guardianPhone: studentData.guardianPhone,
        shortTermGoal: studentData.shortTermGoal,
        longTermGoal: studentData.longTermGoal,
        schoolYear: studentData.schoolYear,
        email: studentData.email,
        password: studentData.password,
        profileUrl: studentData.profileUrl,
        interests: { create: studentData.interests } 
      },
    });
  } catch (error) {
    console.error("Erro em createStudentInDb:", error);
    throw { type: "database_error", message: "Falha ao persistir estudante no banco de dados." };
  }
};

export const findUser = async (email: string) => {
    try {
        return (
            await prisma.student.findUnique({ where: { email } }) ||
            await prisma.teacher.findUnique({ where: { email } }) ||
            await prisma.admin.findUnique({ where: { email } })
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

export const updateStudentInDB = async (userId: number, updateData: any) => {
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

export const deleteStudentInDb = async (id: number) => {
    try {
        await prisma.studentInterest.deleteMany({
            where: { studentId: id }
        });

        return (

            await prisma.student.delete({
                where: { id }
            })
        );
    } catch (error) {
        console.error("Error finding user:", error);
    }
};

