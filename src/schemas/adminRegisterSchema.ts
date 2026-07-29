import Joi, { ObjectSchema } from "joi";
import { AdminType } from "../interfaces";

export const adminRegisterSchema: ObjectSchema<AdminType> = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  function: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(8).max(100).required(),
  profileUrl: Joi.string()
    .uri()
    .optional()
    .default("https://storage.googleapis.com/galaxy-bucket/default-admin.png"),
  role: Joi.string().valid("admin").default("admin"),
});

export default adminRegisterSchema;