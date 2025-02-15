import { studentType } from "interfaces";
import { findUser, findAllStudents, updateStudentInDB, deleteStudentInDb } from "../repository/studentRepository";
import { createContractInDb } from "repository/contractRepository";

export const makeContract = async (email: string, data) => {
    const user = email && await findUser(email);

    if (user?.role === "Teacher") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    
    const result = await createContractInDb(data);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível criar o contrato no momento."
            }
        }
    }
};