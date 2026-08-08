import Joi, { ObjectSchema } from "joi";

export const createPlanSchema: ObjectSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.base": "O nome do plano deve ser um texto.",
        "string.empty": "O nome do plano não pode estar vazio.",
        "any.required": "O nome do plano é obrigatório."
    }),
    description: Joi.string().trim().required().messages({
        "string.base": "A descrição deve ser um texto.",
        "string.empty": "A descrição não pode estar vazia.",
        "any.required": "A descrição é obrigatória."
    }),
    price: Joi.number().positive().precision(2).required().messages({
        "number.base": "O preço deve ser um número.",
        "number.positive": "O preço deve ser maior que zero.",
        "any.required": "O preço é obrigatório."
    }),
    lessonsPerWeek: Joi.number().integer().valid(1, 2, 3).required().messages({
        "number.base": "A quantidade de aulas por semana deve ser um número.",
        "any.only": "As aulas por semana permitidas são apenas 1, 2 ou 3.",
        "any.required": "A quantidade de aulas por semana é obrigatória."
    }),
    totalLessons: Joi.number().integer().positive().required().messages({
        "number.base": "O total de aulas deve ser um número.",
        "number.positive": "O total de aulas deve ser maior que zero.",
        "any.required": "O total de aulas é obrigatório."
    })
});

export const updatePlanSchema: ObjectSchema = Joi.object({
    name: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    price: Joi.number().positive().precision(2).optional(),
    lessonsPerWeek: Joi.number().integer().valid(1, 2, 3).optional(),
    totalLessons: Joi.number().integer().positive().optional()
}).min(1).messages({
    "object.min": "É necessário enviar pelo menos um campo para atualização."
});