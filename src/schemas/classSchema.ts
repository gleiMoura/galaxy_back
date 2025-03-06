import Joi from "joi";

const classSchema = Joi.object({
    studentId: Joi.number().integer().required(),
    teacherId: Joi.number().integer().required(),
    title: Joi.string().min(3).required(),
    subject: Joi.string().min(3).required(),
    sentAt: Joi.string().isoDate().required(),
    pdfUrl: Joi.string().required()
});

export default classSchema;