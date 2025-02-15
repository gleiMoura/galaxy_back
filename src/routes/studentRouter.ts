import { Router } from "express";
import { deleteStudent, getStudent, updateStudent, getStudents } from "controllers/studentController";
import tokenValidator from "middlewares/tokenValidator.js";

const studentRouter = Router();

studentRouter.get("/student", tokenValidator, getStudent);
studentRouter.get("/students", tokenValidator, getStudents);
studentRouter.put("/student", tokenValidator, updateStudent);
studentRouter.delete("/student/:id", tokenValidator, deleteStudent);

export default studentRouter;