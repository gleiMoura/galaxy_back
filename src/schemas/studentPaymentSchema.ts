import Joi from "joi";

const studentPaymentSchema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    studentId: Joi.number().integer().positive().required(),
    amount: Joi.number().precision(2).positive().required(),
    dueDate: Joi.date().iso().required(),
    status: Joi.string().valid('PENDING', 'PAID', 'OVERDUE').default('PENDING'),
    invoiceUrl: Joi.string().uri().required(),
});

export default studentPaymentSchema;