import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import teacherSchema from "schemas/teacherRegisterSchema.js";


const teacherRouter = Router();

//teacher
//teacherRouter.get("/teacher", getTeacher);
//teacherRouter.get("/teachers", getTeachers);
//teacherRouter.put("/teacher", schemaValidator(teacherSchema) updateTeacher);
//teacherRouter.delete("/teacher", deleteTeacher);
//students from teachers
//teacherRouter.get("/teacher/students", getStudentsFromTeacher)
//payments
//teacherRouter.get("/teacher/payments", getPayments);
//classes
//teacherRouter.get("/teacher/classes", getClasses)



export default teacherRouter;