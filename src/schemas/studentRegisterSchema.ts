import { studentRegisterType } from "../interfaces/index.js";
import joi, { ObjectSchema } from "joi";

const studentRegisterSchema: ObjectSchema<studentRegisterType> = joi.object({
    name: joi.string().required(),
    guardianName: joi.string().required(),
    phone: joi.string().required(),
    guardianPhone: joi.string().required(),
    shortTermGoal: joi.string().required(),
    longTermGoal: joi.string().required(),
    schoolYear: joi.number().required(),
    interests: joi.array().required(),
    role: joi.string(),
    email: joi.string().required(),
    password: joi.string().required(),

});

export default studentRegisterSchema;
