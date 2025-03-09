import { deleteTeacherFromDb, findAllTeachers, findSpecificTeacher } from "repository/teacherRepository";

export const findTeacher = async (user: any, id: number) => {
    if(!id) {
        throw {
            response: {
                status: 404,
                message: "Id é necessário para encontrar professor!."
            }
        }
    }
    const teacher = findSpecificTeacher(id);

    if (user?.role === "Student") {
        throw {
            response: {
                status: 409,
                message: "Estudante não pode procurar por um professor."
            }
        }
    }

    if (!teacher) {
        throw {
            response: {
                status: 404,
                message: "Usuário não foi encontrado no sistema."
            }
        }
    };

    return teacher;
};

export const findTeachers = async (user: any) => {
    const teachers = await findAllTeachers();

    if (user?.role === "Student") {
        throw {
            response: {
                status: 409,
                message: "Estudante não pode procurar por professores!"
            }
        }
    };

    return teachers;
};

export const deleteSpecificTeacher = async (user: any, teacherId: number) => {
    await deleteTeacherFromDb(teacherId);

    if (user?.role === "Student") {
        throw {
            response: {
                status: 409,
                message: "Estudante não pode procurar por professores!"
            }
        }
    };
};