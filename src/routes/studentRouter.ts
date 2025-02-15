import { Router } from "express";
import { deleteStudent, getStudent, updateStudent } from "controllers/studentController";
import { getStudents } from "controllers/studentController";
import schemaValidator from "../middlewares/schemaValidator.js";
import tokenValidator from "middlewares/tokenValidator.js";
import studentSchema from "schemas/studentSchema.js";
const studentRouter = Router();

//students routes
studentRouter.get("/student", tokenValidator, getStudent);
studentRouter.get("/students", tokenValidator, getStudents);
studentRouter.put("/student", tokenValidator, updateStudent);
studentRouter.delete("/student/:id", tokenValidator, deleteStudent);
//contract routes
//studentRouter.post('/student/contract', schemaValidator(contractSchema), createContract);
//studentRouter.get('/student/contract', getContracts)
//studentRouter.put('/student/contract', schemaValidator(contractSchema), updateContract);
//studentRouter.delete('/student/contract', deleteContract);
//classes routes
//studentRouter.post('/student/class', createClass);
//studentRouter.get('/student/class', getClass);
//studentRouter.get('/student/classes', getClasses);



export default studentRouter;