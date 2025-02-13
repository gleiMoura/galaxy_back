import { findUser, findAllStudents } from "../repository/studentRepository";

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

    if (user.role !== "Teacher") {
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