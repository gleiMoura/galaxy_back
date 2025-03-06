import { DateTime } from "luxon";
import { createClassInDb, getClassById } from "repository/classRepository";
import { findUser } from "../repository/studentRepository";
import { ClassType } from "interfaces";
import classSchema from "schemas/classSchema";

export const generateClass = async (email: string, data: ClassType, fileUrl: string) => {
    const user = email && await findUser(email);

    if (user?.role === "Student") {
        throw {
            response: {
                status: 400,
                message: "Usuário não tem permissão!"
            }
        }
    };

    const getBrasiliaTime = () => {
        const brasiliaDate = DateTime.now().setZone("America/Sao_Paulo");
        return brasiliaDate.toISO({ suppressMilliseconds: true });
    }

    const info = {
        ...data,
        studentId: parseInt(data.studentId),
        sentAt: getBrasiliaTime(),
        pdfUrl: fileUrl
    };

    const { error } = classSchema.validate(info);

    if (error) {
        throw {
            response: {
                status: 404,
                message: error.details
            }
        }
    }

    const result = await createClassInDb(info);

    if (!result) {
        throw {
            response: {
                status: 400,
                message: "Não foi possível criar a lição no momento."
            }
        }
    }

    return result;
};

export const getSpecificClass = async (id: string) => {
    const classId = parseInt(id);

    if (!id) {
        throw {
            response: {
                status: 404,
                message: "StudentId is necessary!"
            }
        }
    };

    const result = await getClassById(classId);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Não foi possível criar o contrato no momento."
            }
        }
    }

    return result;
};