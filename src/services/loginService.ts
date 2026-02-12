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

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
        ...userWithoutPassword,
        token
    }
};

export default signinUser;
export { signinUser };
