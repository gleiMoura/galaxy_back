import { studentRegisterType } from "../interfaces/index.js";
import joi, { ObjectSchema } from "joi";

const studentSchema: ObjectSchema<studentRegisterType> = joi.object({
    name: joi.string().required(),
    guardianName: joi.string().required(),
    phone: joi.string().required(),
    guardianPhone: joi.string().required(),
    shortTermGoal: joi.string().required(),
    longTermGoal: joi.string().required(),
    schoolYear: joi.number().required(),
    interests: joi.array().required(),
    role: joi.string()
});

export default studentSchema;
