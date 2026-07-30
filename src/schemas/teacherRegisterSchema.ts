import Joi, { ObjectSchema } from "joi";
import { TeacherType } from "../interfaces";

export const teacherRegisterSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "O campo nome é obrigatório.",
    "any.required": "O campo nome é obrigatório.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "O e-mail deve ser um endereço válido.",
    "any.required": "O campo e-mail é obrigatório.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "A senha deve ter no mínimo 6 caracteres.",
    "any.required": "A senha é obrigatória.",
  }),
  cpf: Joi.string().length(11).required().messages({
    "string.length": "O CPF deve conter exatamente 11 dígitos.",
    "any.required": "O campo CPF é obrigatório.",
  }),
  phone: Joi.string().required().messages({
    "any.required": "O campo telefone é obrigatório.",
  }),
  // Tornar os campos acadêmicos opcionais no cadastro inicial (se forem preenchidos posteriormente no perfil):
  subject: Joi.string().optional(),
  academicDegree: Joi.string().optional(),
});

export default teacherRegisterSchema;