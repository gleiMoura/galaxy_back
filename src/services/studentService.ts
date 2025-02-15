import { studentType } from "interfaces";
import { findUser, findAllStudents, updateStudentInDB, deleteStudentInDb } from "../repository/studentRepository";

export const findStudent = async (email: string) => {
    const user = await findUser(email);

    if (!user) {
        throw {
            response: {
                status: 404,
                message: "Usuário não foi encontrado no sistema."
            }
        }
    };

    return user;
};

export const findStudents = async (email: string) => {
    const user = await findUser(email);

    if (!user) {
        throw {
            response: {
                status: 404,
                message: "Usuário não foi encontrado no sistema."
            }
        }
    };

    if (user.role === "Student") {
        throw {
            response: {
                status: 400,
                message: "Usuário não possui permissão!"
            }
        }
    }

    const users = await findAllStudents()

    return users;
};

export const updateUserStudent = async (email: string, updateData: studentType) => {
    const user = await findUser(email);

    if (!user) {
        throw {
            response: {
                status: 404,
                message: "Usuário não foi encontrado no sistema!"
            }
        }
    };

    if (user.role === "Teacher") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    }
    const userId = user.id;
    const users = await updateStudentInDB(userId, updateData)

    return users;
};

export const deleteUserStudent = async (email: string, studentId: string) => {
    const adminUser = email && await findUser(email);

    if (adminUser?.role !== "Admin") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    }

    const id = parseInt(studentId);
    const result = await deleteStudentInDb(id);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível deletar o usuário no momento."
            }
        }
    }
};