import { QuizzType } from "../interfaces/index.js";
import { findUserBySession } from "../repository/loginRepository.js";
import { deleteQuizzInDb, getQuizzesFromDb, getQuizzInDb, getUserQuizzesFromDb, saveQuizzInDb } from "../repository/quizzRepository.js";

export const createQuizz = async (quizz: QuizzType, token: string) => {
    const session = await findUserBySession(token);

    if (!session) {
        throw {
            response: {
                status: 404,
                message: "User is not loged in system!"
            }
        }
    };

    const userId = session.userId;

    const quizzToCreate = {
        userId,
        ...quizz
    };

    const result = await saveQuizzInDb(quizzToCreate);

    if (result) {
        return quizzToCreate;
    } else {
        throw {
            response: {
                status: 500,
                message: "Quizz was not created, because mongo problem"
            }
        }
    }
};

export const getAllQuizzes = async () => {
    const quizzes = await getQuizzesFromDb();

    if (!quizzes) {
        throw {
            response: {
                status: 404,
                message: "Problem to find quizzes!"
            }
        }
    };

    return quizzes;
};

export const getUserQuizzes = async (token: string) => {
    const session = await findUserBySession(token);

    if (!session) {
        throw {
            response: {
                status: 404,
                message: "User is not loged in system!"
            }
        }
    };

    const userId = session.userId;

    const quizzes = await getUserQuizzesFromDb(userId);

    if (!quizzes) {
        throw {
            response: {
                status: 404,
                message: "Problem to find quizzes!"
            }
        }
    };

    return quizzes;
};

export const deleteQuizzById = async (id: string) => {

    if (!id) {
        throw {
            response: {
                status: 404,
                message: "Quizz does not exist!"
            }
        }
    };

    await deleteQuizzInDb(id);
};
export const takeQuizzById = async (id: string) => {

    if (!id) {
        throw {
            response: {
                status: 404,
                message: "Quizz does not exist!"
            }
        }
    };


    const quizz = await getQuizzInDb(id);

    return quizz
};
