import database from "../config/index.js"
import { registerType } from "../interfaces/index.js";

export const logUserInDb = async (credentials: registerType) => {
    try {
        const db = await database;
        await db.collection('users').insertOne(credentials)
    } catch (error) {
        console.log("Error trying log user in db", error);
    }
};

export const updateUserInDb = async (userId: string, profileLink: string) => {
    try {
        const db = await database;
        const result = await db.collection('users').updateOne(
            { userId },
            { $set: { profileLink } },
            { writeConcern: { w: 1 } }
        );

        return result;
    } catch (error) {
        console.log("Error trying log user in db", error);
    }
}
