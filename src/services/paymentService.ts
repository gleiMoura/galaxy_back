import { createStudentPaymentInDb, createTeacherPaymentInDb } from "repository/paymentRepository";

export const createNewPayment = async (user: any, data) => {
    if (user?.role !== "Admin") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    let result = null;

    if ('studentId' in data) {
        result = await createStudentPaymentInDb(data);
    } else if ('teacherId' in data) {
        result = await createTeacherPaymentInDb(data);
    }


    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível criar o pagamento no momento."
            }
        }
    }
};
