import { loginType } from "../interfaces/index.js";
import { findUser } from "../repository/studentRepository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const signinUser = async (credentials: loginType) => {
  const { email, password } = credentials;

  const user = await findUser(email);

  const isPasswordValid = user ? bcrypt.compareSync(password, user.password) : false;

  if (!user || !isPasswordValid) {
    const error: any = new Error("E-mail ou senha incorretos.");
    error.status = 401; 
    throw error;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("Chave privada JWT_SECRET não configurada no servidor.");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: "3d" }
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    ...userWithoutPassword,
    token
  };
};

export default signinUser;