import { registerType } from "../interfaces/index.js";
import joi, { ObjectSchema } from "joi";

const postSchema: ObjectSchema<registerType> = joi.object({
    caption: joi.string().required(),
});

export default postSchema;
