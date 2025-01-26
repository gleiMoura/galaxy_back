import { getPostsFromDb, getUserPostsFromDb, savePostInDb } from "../repository/postRepository.js";
import { findUserBySession } from "../repository/loginRepository.js";

export const createPost = async (caption: string, token: string, photo: string) => {
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

    const postToCreate = {
        userId,
        caption,
        photo
    };

    const result = await savePostInDb(postToCreate);

    if (result) {
        return postToCreate;
    } else {
        throw {
            response: {
                status: 500,
                message: "Quizz was not created, because mongo problem"
            }
        }
    }
};

export const getAllPosts = async () => {
    const posts = await getPostsFromDb();

    if (!posts) {
        throw {
            response: {
                status: 404,
                message: "Problem to find posts!"
            }
        }
    };

    return posts;
};

export const getUserPosts = async (token: string) => {
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

    const posts = await getUserPostsFromDb(userId);

    if (!posts) {
        throw {
            response: {
                status: 404,
                message: "Problem to find posts!"
            }
        }
    };

    return posts;
};