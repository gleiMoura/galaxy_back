import { ObjectId } from "mongodb";
import database from "../config/index.js"
import { QuizzType } from "../interfaces/index.js";

export const saveQuizzInDb = async (quizz: QuizzType) => {
    try {
        const db = await database;
        const result = await db.collection('quizz').insertOne(quizz);
        return result;
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};

export const getQuizzesFromDb = async () => {
    try {
        const db = await database;
        const result = await db.collection('quizz').find().toArray();
        return result;
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};

export const getUserQuizzesFromDb = async (userId: string) => {
    try {
        const db = await database;
        const result = await db.collection('quizz').find({ userId }).toArray();
        return result;
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};

export const deleteQuizzInDb = async (id: string) => {
    try {
        const db = await database;
        const objectId = new ObjectId(id);
        const result = await db.collection('quizz').deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            throw new Error("Quizz not found or already deleted");
        }
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};

export const getQuizzInDb = async (id: string) => {
    try {
        const db = await database;
        const objectId = new ObjectId(id);
        const result = await db.collection('quizz').findOne({ _id: objectId });
        return result;
    } catch (error) {
        console.log("Error trying to save quizz", error);
        throw error
    }
};
