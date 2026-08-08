import adminRegisterSchema from "./adminRegisterSchema";
import studentRegisterSchema from "./studentRegisterSchema";
import teacherRegisterSchema from "./teacherRegisterSchema";
import loginSchema from "./loginSchema";
import studentSchema from "./studentSchema";
import teacherSchema from "./teacherSchema";
import {createContractSchema, updateContractSchema} from "./contractSchema";

const schemas = {
    adminRegisterSchema,
    studentRegisterSchema,
    teacherRegisterSchema,
    loginSchema,
    studentSchema,
    teacherSchema,
    updateContractSchema,
    createContractSchema
};

export default schemas;