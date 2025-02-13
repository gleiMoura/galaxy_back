import Joi, { ObjectSchema } from "joi";
import { TeacherType } from "../interfaces/index.js";

const teacherSchema: ObjectSchema<TeacherType> = Joi.object({
    name: Joi.string().required(),
    subject: Joi.string().required(),
    funFactOne: Joi.string().optional(),
    funFactTwo: Joi.string().optional(),
    academicDegree: Joi.string().required(),
    role: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export default teacherSchema;
