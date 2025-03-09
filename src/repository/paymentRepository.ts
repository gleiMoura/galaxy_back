import prisma from "config";

export const createStudentPaymentInDb = async (data) => {
    try {
        return (
            await prisma.studentPayment.create({
                data
            })
        );
    } catch (error) {
        console.error("Error trying to create a payment to student user:", error);
    }
};

export const createTeacherPaymentInDb = async (data) => {
    try {
        return (
            await prisma.payment.create({
                data
            })
        );
    } catch (error) {
        console.error("Error trying to create a payment to teacher user:", error);
    }
};

export const getStudentPaymentInDb = async (id: number) => {
    try {
        return (
            await prisma.studentPayment.findUnique({
                where: {
                    id
                }
            })
        );
    } catch (error) {
        console.error("Error trying to find a payment", error);
    }
};

export const getStudentPaymentsInDb = async () => {
    try {
        return (
            await prisma.studentPayment.findMany()
        );
    } catch (error) {
        console.error("Error trying to find a payment", error);
    }
};

export const getTeacherPaymentInDb = async (id: number) => {
    try {
        return (
            await prisma.payment.findUnique({
                where: {
                    id
                }
            })
        );
    } catch (error) {
        console.error("Error trying to create a payment to teacher user:", error);
    }
};

export const getTeacherPaymentsInDb = async () => {
    try {
        return (
            await prisma.payment.findMany()
        );
    } catch (error) {
        console.error("Error trying to create a payment to teacher user:", error);
    }
};