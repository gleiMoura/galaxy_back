import { createClassInDb } from "repository/classRepository";
import { findUser } from "../repository/studentRepository";
import { ClassType } from "interfaces";

export const generateClass = async (email: string, data: ClassType) => {
    const user = email && await findUser(email);

    if (user?.role === "Student") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    const result = await createClassInDb(data);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível criar o contrato no momento."
            }
        }
    }
};