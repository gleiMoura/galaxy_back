import { loginType } from "../interfaces/index.js";
import joi, { ObjectSchema } from "joi";

const loginSchema: ObjectSchema<loginType> = joi.object({
  email: joi.string().email().trim().lowercase().required().messages({
    "string.email": "Forneça um e-mail válido.",
    "string.empty": "O e-mail é obrigatório."
  }),
  password: joi.string().required().messages({
    "string.empty": "A senha é obrigatória."
  }),
});

export default loginSchema;