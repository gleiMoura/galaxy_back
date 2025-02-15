import { loginType } from "../interfaces/index.js";
import { findUser } from "../repository/studentRepository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()

const signinUser = async (credentials: loginType) => {
    const { email, password } = credentials;

    const user = await findUser(email);

    const confirmPassword = user && bcrypt.compareSync(password, user.password);

    if (!user || !confirmPassword) {
        throw {
            response: {
                message: "Usuário ou senha incorretos!",
                status: 404
            }
        }
    };

    try {
        const userId = user.id;
        const token = jwt.sign(
            { id: userId, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        )
        delete user.password;

        const userInformation = {
            id: user.id,
            name: user.name,
            profileUrl: user.profileUrl,
            role: user.role,
            email,
            token
        };
        return userInformation;
    } catch (error) {
        console.error("Erro no servidor, " + error);
    }
};

export default signinUser;