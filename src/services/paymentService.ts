import { response } from "express";
import { createStudentPaymentInDb, createTeacherPaymentInDb, getStudentPaymentInDb, getStudentPaymentsInDb, getTeacherPaymentInDb, getTeacherPaymentsInDb } from "repository/paymentRepository";

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

export const findPayment = async (user: any, paymentId: string) => {
    let result = null;
    const id = parseInt(paymentId);

    if (!paymentId || !id) {
        throw {
            response: {
                status: 404,
                message: "Id é necessário para achar pagamento"
            }
        }
    }

    if (user?.role === "Student") {
        result = await getStudentPaymentInDb(id);
    } else if (user?.role === "Teacher") {
        result = await getTeacherPaymentInDb(id);
    } else if(user?.role === "Admin") {
        result = {
            student: await getStudentPaymentInDb(id),
            teacher: await getTeacherPaymentInDb(id)
        }
    }

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível encontrar o pagamento no momento."
            }
        }
    }

    return result;
};

export const findPayments = async (user: any) => {
    let result = null;

    if (user?.role === "Student") {
        result = await getStudentPaymentsInDb();
    } else if (user?.role === "Teacher") {
        result = await getTeacherPaymentsInDb();
    } else if (user?.role === "Admin") {
        result = {
            student: await getStudentPaymentsInDb(),
            teacher: await getTeacherPaymentsInDb()
        }
    }

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível encontrar o pagamento no momento."
            }
        }
    }

    return result;
};
