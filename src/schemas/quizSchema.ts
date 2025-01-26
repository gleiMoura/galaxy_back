import joi, { ObjectSchema } from 'joi';

const optionSchema = joi.object({
    option1: joi.string().required(),
    option2: joi.string().optional(),
    option3: joi.string().optional(),
});

const questionSchema = joi.object({
    title: joi.string().required(),
    options: optionSchema.required(),
});

const rightOptionsSchema = joi.object({
    firstQuestion: joi.string().required(),
    secondQuestion: joi.string().optional(),
    thirdQuestion: joi.string().optional(),
});

const answersSchema = joi.object({
    oneRight: joi.string().required(),
    twoRight: joi.string().optional(),
    threeRight: joi.string().optional(),
});

const quizzSchema: ObjectSchema = joi.object({
    title: joi.string().required(),
    firstQuestion: questionSchema.required(),
    secondQuestion: questionSchema.optional(),
    thirdQuestion: questionSchema.optional(),
    rightOptions: rightOptionsSchema.required(),
    answers: answersSchema.required(),
});

export default quizzSchema;
