import prisma from "config/index.js";
import { studentRegisterType, teacherRegisterType } from "interfaces";

export const logUserInDb = async (userData) => {
    try {
        if (userData.role === "Teacher") {
            return await prisma.teacher.create({
                data: userData
            });
        } else if (userData.role === "Student") {
            return await prisma.student.create({
                data: {
                    ...userData, interests: {
                        create: userData.interests.map(subject => ({
                            subject
                        }))
                    }
                }
            });
        } else {
            return null
        }
    } catch (error) {
        console.error("Problem in repository trying log user!", error);
    }
};

export const updateUserInDb = async (user: studentRegisterType | teacherRegisterType, profileLink: string) => {
    try {
        let result = null;

        if (user.role === "student") {
            result = await prisma.student.update({
                where: { email: user.email },
                data: { profileUrl: profileLink },
            });
        } else {
            result = await prisma.teacher.update({
                where: { email: user.email },
                data: { profileUrl: profileLink },
            });
        }

        return result;

    } catch (error) {
        console.error("Error updating user profile in DB:", error);
    }
};
