import Joi from "joi";

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const singleAvailabilitySchema = Joi.object({
  weekday: Joi.number().integer().min(1).max(7).required().messages({
    "number.base": "O dia da semana deve ser um número.",
    "number.min": "O dia da semana deve ser no mínimo 1 (Domingo).",
    "number.max": "O dia da semana deve ser no máximo 7 (Sábado).",
    "any.required": "O dia da semana é obrigatório.",
  }),

  startTime: Joi.string().pattern(timeFormatRegex).required().messages({
    "string.pattern.base":
      "O horário de início deve estar no formato HH:mm (ex: '14:30').",
    "any.required": "O horário de início é obrigatório.",
  }),

  endTime: Joi.string().pattern(timeFormatRegex).required().messages({
    "string.pattern.base":
      "O horário de término deve estar no formato HH:mm (ex: '15:30').",
    "any.required": "O horário de término é obrigatório.",
  }),

  isExtraHour: Joi.boolean().default(false).messages({
    "boolean.base": "O campo de hora extra deve ser um booleano.",
  }),
});

export const availabilitySchema = Joi.object({
  availabilities: Joi.array()
    .items(singleAvailabilitySchema)
    .min(1)
    .required()
    .messages({
      "array.base": "O campo disponibilidades deve ser uma lista.",
      "array.min": "Informe pelo menos um horário de disponibilidade.",
      "any.required": "A lista de disponibilidades é obrigatória.",
    }),
});

export default availabilitySchema;