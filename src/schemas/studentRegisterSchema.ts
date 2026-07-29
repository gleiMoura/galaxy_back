import Joi, { ObjectSchema } from "joi";
import { studentRegisterType } from "../interfaces";

export const studentRegisterSchema: ObjectSchema<studentRegisterType> = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(8).max(100).required(),
  guardianName: Joi.string().trim().allow("", null).optional(),
  phone: Joi.string().trim().pattern(/^\+?[1-9]\d{1,14}$/).allow("", null).optional(),
  guardianPhone: Joi.string().trim().pattern(/^\+?[1-9]\d{1,14}$/).allow("", null).optional(),
  shortTermGoal: Joi.string().trim().allow("", null).optional(),
  longTermGoal: Joi.string().trim().allow("", null).optional(),
  schoolYear: Joi.number().integer().min(1).max(12).required(),
  interests: Joi.array().items(
    Joi.object({
      subject: Joi.string().trim().required()
    }).or('subject')
  ).min(1).required(),
  profileUrl: Joi.string().uri().optional().default("https://storage.googleapis.com/galaxy-bucket/default-avatar.png"),
  role: Joi.string().valid("student").default("student")
});

export default studentRegisterSchema;