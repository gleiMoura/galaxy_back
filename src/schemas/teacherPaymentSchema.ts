import Joi from "joi";

const teacherPaymentSchema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    teacherId: Joi.number().integer().positive().required(),
    amount: Joi.number().precision(2).positive().required(),
    paidAt: Joi.date().iso().required()
});

export default teacherPaymentSchema;
