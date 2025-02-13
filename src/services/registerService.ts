import bcrypt from "bcrypt";
import { teacherRegisterType, studentRegisterType } from "../interfaces/index.js";
import { findUser } from "../repository/studentRepository.js";
import { logUserInDb, updateUserInDb } from "../repository/registerRepository.js";

export const logUser = async (credentials: teacherRegisterType | studentRegisterType) => {
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
                status: 400,
                message: "Problem in service to log user!"
            }
        }
    };

    return result;
};

export const logUserWithProfileLink = async (userEmail: string, profileLink: string) => {
    const user = await findUser(userEmail);

    if (!user) {
        throw {
            response: {
                status: 409,
                message: "User is not loged in system"
            }
        }
    }

    const result = await updateUserInDb(user, profileLink);

    if (!result) {
        throw {
            response: {
                status: 400,
                message: "It is not possible save image!"
            }
        }
    };

    return ({
        profileUrl: profileLink
    });
};

