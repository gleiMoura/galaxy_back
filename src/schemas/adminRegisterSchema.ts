import Joi, { ObjectSchema } from "joi";
import { TeacherType } from "../interfaces/index.js";

const adminRegisterSchema: ObjectSchema<TeacherType> = Joi.object({
    name: Joi.string().required(),
    function: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required()
});

export default adminRegisterSchema;