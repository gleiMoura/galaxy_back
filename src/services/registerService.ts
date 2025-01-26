import bcrypt from "bcrypt";
import { registerType } from "../interfaces/index.js";
import { findUser, findUserBySession } from "../repository/loginRepository.js";
import { logUserInDb, updateUserInDb } from "../repository/registerRepository.js";

export const logUser = async (credentials: registerType) => {
    const { password, email } = credentials;

    const passwordCrypt = bcrypt.hashSync(password, 10);

    const user = await findUser(email);

    if (user) {
        throw {
            response: {
                status: 409,
                message: "User is loged in system"
            }
        }
    };

    await logUserInDb({ ...credentials, password: passwordCrypt });
};

export const logUserWithProfileLink = async (token: string, profileLink: string) => {
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

    const result = await updateUserInDb(userId, profileLink);

    if (result) {
        return ({
            token,
            profileLink
        });
    };
};

