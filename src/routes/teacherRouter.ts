import { Router } from "express";
import tokenValidator from "middlewares/tokenValidator.js";
import { deleteTeacher, getTeacher, getTeachers } from "controllers/teacherController.js";
import { createPayment, getPayment, getPayments } from "controllers/paymentController";
import schemaValidator from "middlewares/schemaValidator";
import teacherPaymentSchema from "schemas/teacherPaymentSchema";


const teacherRouter = Router();

teacherRouter.get("/teacher/:id", tokenValidator, getTeacher);
teacherRouter.get("/teachers", tokenValidator, getTeachers);
teacherRouter.delete("/teacher", tokenValidator, deleteTeacher);
//payments
teacherRouter.post("/payment/teacher", tokenValidator, schemaValidator(teacherPaymentSchema), createPayment)
teacherRouter.get("/payment/teacher/:id", tokenValidator, getPayment);
teacherRouter.get("/payments/teacher", tokenValidator, getPayments);



export default teacherRouter;