import bcrypt from "bcrypt";
import { AppError } from "../interfaces";
import { teacherRegisterType, studentRegisterType, AdminCreateInput } from "../interfaces";
import { findUser, findStudentByEmail, createStudentInDb } from "../repository/studentRepository";
import { createAdminInDb, updateUserInDb } from "../repository/registerRepository";
import { findTeacherByEmailOrCpf, createTeacherInDb } from "repository/teacherRepository";
export const registerStudentService = async (payload: studentRegisterType) => {
  const existingStudent = await findStudentByEmail(payload.email);
  if (existingStudent) {
    throw { type: "conflict", message: "Este e-mail já está cadastrado no sistema." };
  }
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const newStudentData: studentRegisterType = {
    ...payload,
    password: hashedPassword,
  };
  return await createStudentInDb(newStudentData);
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

// 3. Serviço de Cadastro de Admin
export const registerAdminService = async (payload: AdminCreateInput) => {
  const existingUser = await findUser(payload.email);
  if (existingUser) {
    throw { status: 409, message: "E-mail já cadastrado no sistema." };
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await createAdminInDb({
    ...payload,
    password: hashedPassword,
  });
};

// 4. Serviço para Atualização do Link da Foto de Perfil (GCS)
export const logUserWithProfileLink = async (userEmail: string, fileLink: string) => {
  if (!fileLink) {
    throw { status: 400, message: "URL do arquivo não informada." };
  }

  const user = await findUser(userEmail);
  if (!user) {
    throw { status: 404, message: "Usuário não encontrado." };
  }

  const updatedUser = await updateUserInDb(user, fileLink);
  if (!updatedUser) {
    throw { status: 400, message: "Erro ao atualizar imagem de perfil no banco." };
  }

  return { profileUrl: updatedUser.profileUrl };
};