import Joi, { ObjectSchema } from "joi";
import { TeacherType } from "../interfaces";

export const teacherRegisterSchema: ObjectSchema<TeacherType> = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(8).max(100).required(),
  subject: Joi.string().trim().required(),
  academicDegree: Joi.string().trim().required(),
  funFactOne: Joi.string().trim().allow("", null).optional(),
  funFactTwo: Joi.string().trim().allow("", null).optional(),
  profileUrl: Joi.string().uri().optional().default("https://storage.googleapis.com/galaxy-bucket/default-avatar.png"),
  role: Joi.string().valid("teacher").default("teacher")
});

export default teacherRegisterSchema;