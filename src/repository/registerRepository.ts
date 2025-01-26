import { ObjectId } from "mongodb";
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
        const userObjectId = new ObjectId(userId);
        const result = await db.collection('users').updateOne(
            { _id: userObjectId },
            { $set: { profileUrl: profileLink } },
            { writeConcern: { w: 1 } }
        );

        return result;
    } catch (error) {
        console.log("Error trying log user in db", error);
    }
}
