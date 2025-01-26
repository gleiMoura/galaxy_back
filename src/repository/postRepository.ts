import database from "../config/index.js"
import { PostType } from "../interfaces/index.js";

export const savePostInDb = async (post: PostType) => {
    try {
        const db = await database;
        const result = await db.collection('post').insertOne(post);
        return result;
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};

export const getPostsFromDb = async () => {
    try {
        const db = await database;
        const result = await db.collection('post').find().toArray();
        return result;
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};

export const getUserPostsFromDb = async (userId: string) => {
    try {
        const db = await database;
        const result = await db.collection('post').find({ userId }).toArray();
        return result;
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};
