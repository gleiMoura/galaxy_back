import Joi, { ObjectSchema } from "joi";
import { AdminType } from "../interfaces";

export const adminRegisterSchema: ObjectSchema<AdminType> = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "O nome é obrigatório.",
    "string.min": "O nome deve ter pelo menos 2 caracteres.",
  }),
  function: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "A função/cargo é obrigatória.",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Insira um e-mail válido.",
    "string.empty": "O e-mail é obrigatório.",
  }),
  password: Joi.string().min(8).max(100).required().messages({
    "string.min": "A senha deve ter no mínimo 8 caracteres.",
    "string.empty": "A senha é obrigatória.",
  }),
  profileUrl: Joi.string()
    .uri()
    .optional()
    .default("https://storage.googleapis.com/galaxy-bucket/default-admin.png"),
  role: Joi.string()
    .valid("admin")
    .optional()
    .default("admin"),
});

export default adminRegisterSchema;