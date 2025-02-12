import bcrypt from "bcrypt";
import { registerType } from "../interfaces/index.js";
import { findUser } from "../repository/loginRepository.js";
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

    const info = {
        ...credentials,
        profileUrl: "",
        password: passwordCrypt,
    }

    const result = await logUserInDb(info);

    if (!result) {
        throw {
            response: {
                status: 500,
                message: "Problem in service to log user!"
            }
        }
    };
};

export const logUserWithProfileLink = async (userId: number, profileLink: string) => {

    const result = await updateUserInDb(userId, profileLink);

    if (result) {
        return ({
            profileUrl: profileLink
        });
    };
};

