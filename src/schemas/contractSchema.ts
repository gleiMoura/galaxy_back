import joi, { ObjectSchema } from "joi";

const contractSchema: ObjectSchema = joi.object({
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    lessonsPerWeek: joi.number().integer().min(1).required(),
    usedLessons: joi.number().integer().min(0).default(0),
    contractTotalLessons: joi.number().integer().min(12).required(),
    firstMonthLessons: joi.number().integer().min(4).required(),
    secondMonthLessons: joi.number().integer().min(4).required(),
    thirdMonthLessons: joi.number().integer().min(4).required(),
    signed: joi.boolean().default(false),
    planId: joi.number().integer().required(),
    studentId: joi.number().integer().required(),
    teacherId: joi.number().integer().optional(),
});

export default contractSchema;

