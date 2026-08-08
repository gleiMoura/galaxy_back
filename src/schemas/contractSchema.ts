import Joi, { ObjectSchema } from "joi";

export const createContractSchema: ObjectSchema = Joi.object({
  startDate: Joi.date().iso().required().messages({
    "date.base": "A data de início deve ser uma data válida.",
    "date.format": "A data de início deve estar no formato ISO (ex: YYYY-MM-DDTHH:mm:ss.sssZ).",
    "any.required": "A data de início é obrigatória."
  }),

  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
    "date.base": "A data de término deve ser uma data válida.",
    "date.format": "A data de término deve estar no formato ISO.",
    "date.greater": "A data de término deve ser posterior à data de início.",
    "any.required": "A data de término é obrigatória."
  }),

  lessonsPerWeek: Joi.number().integer().valid(1, 2, 3).required().messages({
    "number.base": "A quantidade de aulas por semana deve ser um número.",
    "any.only": "As aulas por semana permitidas são apenas 1, 2 ou 3.",
    "any.required": "A quantidade de aulas por semana é obrigatória."
  }),

  usedLessons: Joi.number().integer().min(0).default(0).messages({
    "number.base": "As aulas utilizadas devem ser um número.",
    "number.min": "As aulas utilizadas não podem ser menores que 0."
  }),

  contractTotalLessons: Joi.number().integer().min(12).required().messages({
    "number.base": "O total de aulas do contrato deve ser um número.",
    "number.min": "O total mínimo de aulas do contrato é 12.",
    "any.required": "O total de aulas do contrato é obrigatório."
  }),

  firstMonthLessons: Joi.number().integer().min(4).required().messages({
    "number.base": "As aulas do primeiro mês devem ser um número.",
    "number.min": "O primeiro mês deve ter no mínimo 4 aulas estimadas.",
    "any.required": "As aulas do primeiro mês são obrigatórias."
  }),

  secondMonthLessons: Joi.number().integer().min(4).required().messages({
    "number.base": "As aulas do segundo mês devem ser um número.",
    "number.min": "O segundo mês deve ter no mínimo 4 aulas estimadas.",
    "any.required": "As aulas do segundo mês são obrigatórias."
  }),

  thirdMonthLessons: Joi.number().integer().min(4).required().messages({
    "number.base": "As aulas do terceiro mês devem ser um número.",
    "number.min": "O terceiro mês deve ter no mínimo 4 aulas estimadas.",
    "any.required": "As aulas do terceiro mês são obrigatórias."
  }),

  signed: Joi.boolean().default(false).messages({
    "boolean.base": "O status de assinatura deve ser um valor booleano."
  }),

  planId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do plano deve ser um número.",
    "number.positive": "O ID do plano deve ser um número positivo.",
    "any.required": "O ID do plano é obrigatório."
  }),

  studentId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do aluno deve ser um número.",
    "number.positive": "O ID do aluno deve ser um número positivo.",
    "any.required": "O ID do aluno é obrigatório."
  }),

  teacherId: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "O ID do professor deve ser um número.",
    "number.positive": "O ID do professor deve ser um número positivo."
  })
});


export const updateContractSchema: ObjectSchema = Joi.object({
  startDate: Joi.date().iso().optional().messages({
    "date.base": "A data de início deve ser uma data válida.",
    "date.format": "A data de início deve estar no formato ISO."
  }),

  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional().messages({
    "date.base": "A data de término deve ser uma data válida.",
    "date.format": "A data de término deve estar no formato ISO.",
    "date.greater": "A data de término deve ser posterior à data de início."
  }),

  lessonsPerWeek: Joi.number().integer().valid(1, 2, 3).optional().messages({
    "number.base": "A quantidade de aulas por semana deve ser um número.",
    "any.only": "As aulas por semana permitidas são apenas 1, 2 ou 3."
  }),

  usedLessons: Joi.number().integer().min(0).optional().messages({
    "number.base": "As aulas utilizadas devem ser um número.",
    "number.min": "As aulas utilizadas não podem ser menores que 0."
  }),

  contractTotalLessons: Joi.number().integer().min(12).optional().messages({
    "number.base": "O total de aulas do contrato deve ser um número.",
    "number.min": "O total mínimo de aulas do contrato é 12."
  }),

  firstMonthLessons: Joi.number().integer().min(4).optional().messages({
    "number.base": "As aulas do primeiro mês devem ser um número.",
    "number.min": "O primeiro mês deve ter no mínimo 4 aulas estimadas."
  }),

  secondMonthLessons: Joi.number().integer().min(4).optional().messages({
    "number.base": "As aulas do segundo mês devem ser um número.",
    "number.min": "O segundo mês deve ter no mínimo 4 aulas estimadas."
  }),

  thirdMonthLessons: Joi.number().integer().min(4).optional().messages({
    "number.base": "As aulas do terceiro mês devem ser um número.",
    "number.min": "O terceiro mês deve ter no mínimo 4 aulas estimadas."
  }),

  signed: Joi.boolean().optional().messages({
    "boolean.base": "O status de assinatura deve ser um valor booleano."
  }),

  planId: Joi.number().integer().positive().optional().messages({
    "number.base": "O ID do plano deve ser um número.",
    "number.positive": "O ID do plano deve ser um número positivo."
  }),

  studentId: Joi.number().integer().positive().optional().messages({
    "number.base": "O ID do aluno deve ser um número.",
    "number.positive": "O ID do aluno deve ser um número positivo."
  }),

  teacherId: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "O ID do professor deve ser um número.",
    "number.positive": "O ID do professor deve ser um número positivo."
  })
}).min(1).messages({
  "object.min": "É necessário enviar pelo menos um campo para atualização."
});