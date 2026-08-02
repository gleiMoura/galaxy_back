import bcrypt from "bcrypt";
import { AppError } from "../interfaces";
import { teacherRegisterType, studentRegisterType, AdminCreateInput } from "../interfaces";
import { findUser, findStudentByEmail, createStudentInDb } from "../repository/studentRepository";
import { createAdminInDb, updateUserInDb } from "../repository/registerRepository";
import { findTeacherByEmailOrCpf, createTeacherInDb } from "../repository/teacherRepository";

export const registerStudentService = async (payload: studentRegisterType) => {
  const existingStudent = await findStudentByEmail(payload.email);

  if (existingStudent) {
    throw new AppError("Este e-mail já está cadastrado no sistema.", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await createStudentInDb({
    ...payload,
    password: hashedPassword,
  });
};

export const registerTeacherService = async (payload: teacherRegisterType) => {
  const existingUser = await findTeacherByEmailOrCpf(payload.email, payload.cpf);

  if (existingUser) {
    const conflictField = existingUser.email === payload.email ? 'E-mail' : 'CPF';
    throw new AppError(`${conflictField} já cadastrado no sistema.`, 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await createTeacherInDb({
    ...payload,
    password: hashedPassword,
  });
};

export const registerAdminService = async (payload: AdminCreateInput) => {
  const existingUser = await findUser(payload.email);

  if (existingUser) {
    throw new AppError("E-mail já cadastrado no sistema.", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await createAdminInDb({
    ...payload,
    password: hashedPassword,
  });
};

export const logUserWithProfileLink = async (userEmail: string, profileUrl: string) => {
  if (!profileUrl) {
    throw new AppError("URL do arquivo não informada.", 400);
  }

  const user = await findUser(userEmail);

  if (!user) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  const updatedUser = await updateUserInDb(user, profileUrl);

  if (!updatedUser) {
    throw new AppError("Erro ao atualizar imagem de perfil no banco.", 400);
  }

  return { profileUrl: updatedUser.profileUrl };
};