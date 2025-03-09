import { Router } from "express";
import { deleteStudent, getStudent, updateStudent, getStudents } from "controllers/studentController";
import tokenValidator from "middlewares/tokenValidator.js";
import { createPayment, getPayment, getPayments } from "controllers/paymentController";
import schemaValidator from "middlewares/schemaValidator";
import studentPaymentSchema from "schemas/studentPaymentSchema";

const studentRouter = Router();

studentRouter.get("/student/:id", tokenValidator, getStudent);
studentRouter.get("/students", tokenValidator, getStudents);
studentRouter.put("/student", tokenValidator, updateStudent);
studentRouter.delete("/student/:id", tokenValidator, deleteStudent);
//payment
studentRouter.post("/payment/student", tokenValidator, schemaValidator(studentPaymentSchema), createPayment);
studentRouter.get("/payment/student/:id", tokenValidator, getPayment);
studentRouter.get("/payments/student", tokenValidator, getPayments)

export default studentRouter;