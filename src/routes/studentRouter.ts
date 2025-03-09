import { Router } from "express";
import { deleteStudent, getStudent, updateStudent, getStudents } from "controllers/studentController";
import tokenValidator from "middlewares/tokenValidator.js";
import { createPayment } from "controllers/paymentController";
import schemaValidator from "middlewares/schemaValidator";
import studentPaymentSchema from "schemas/studentPaymentSchema";

const studentRouter = Router();

studentRouter.get("/student/:id", tokenValidator, getStudent);
studentRouter.get("/students", tokenValidator, getStudents);
studentRouter.put("/student", tokenValidator, updateStudent);
studentRouter.delete("/student/:id", tokenValidator, deleteStudent);
//payment
studentRouter.post("/student/payment", tokenValidator, schemaValidator(studentPaymentSchema), createPayment);
//studentRouter.get("/student/payment", tokenValidator, getStudentPayment);
//studentRouter.get("/student/payment", tokenValidator, getStudentPayments)

export default studentRouter;