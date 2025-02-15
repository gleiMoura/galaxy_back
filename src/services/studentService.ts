import { studentType } from "interfaces";
import { findUser, findAllStudents, updateStudentInDB, deleteStudentInDb } from "../repository/studentRepository";

export const findStudent = async (email: string) => {
    const user = await findUser(email);

    if (!user) {
        throw {
            response: {
                status: 404,
                message: "User was not found in sistem!"
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
                message: "User was not found in sistem!"
            }
        }
    };

    if (user.role === "Student") {
        throw {
            response: {
                status: 400,
                message: "User doen't have permission!"
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
                message: "User was not found in sistem!"
            }
        }
    };

    if (user.role === "Teacher") {
        throw {
            response: {
                status: 400,
                message: "User doen't have permission!"
            }
        }
    }
    const userId = user.id;
    const users = await updateStudentInDB(userId, updateData)

    return users;
};

export const deleteUserStudent = async (email: string, studentId) => {
    const adminUser = await findUser(email);

    if (adminUser.role !== "admin") {
        throw {
            response: {
                status: 400,
                message: "User doen't have permission!"
            }
        }
    }

    const result = await deleteStudentInDb(studentId)

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "It was not possible delete user at the moment."
            }
        }
    }
};