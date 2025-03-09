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