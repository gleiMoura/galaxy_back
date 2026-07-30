import prisma from "../config/index";
import { AdminCreateInput } from "../interfaces";

export const createAdminInDb = async (data: AdminCreateInput) => {
    return await prisma.admin.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            function: data.function,
            profileUrl: data.profileUrl || "https://storage.googleapis.com/galaxy-bucket/default-admin.png",
        },
    });
};

export const updateUserInDb = async (
    user: { email: string; role: string },
    fileLink: string
) => {
    const normalizedRole = user.role.toLowerCase();

    if (normalizedRole === "student") {
        return await prisma.student.update({
            where: { email: user.email },
            data: { profileUrl: fileLink },
        });
    }

    if (normalizedRole === "teacher") {
        return await prisma.teacher.update({
            where: { email: user.email },
            data: { profileUrl: fileLink },
        });
    }

    if (normalizedRole === "admin") {
        return await prisma.admin.update({
            where: { email: user.email },
            data: { profileUrl: fileLink },
        });
    }

    return null;
};