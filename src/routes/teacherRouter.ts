import { Router } from "express";
import tokenValidator from "middlewares/tokenValidator.js";
import { deleteTeacher, getTeacher, getTeachers } from "controllers/teacherController.js";


const teacherRouter = Router();

teacherRouter.get("/teacher", tokenValidator, getTeacher);
teacherRouter.get("/teachers", tokenValidator, getTeachers);
teacherRouter.delete("/teacher", tokenValidator, deleteTeacher);
//payments
//teacherRouter.put("/teacher/payment", tokenValidator, createTeacherPayment)
//teacherRouter.get("/teacher/payment", tokenValidator, getPayment);
//teacherRouter.get("/teacher/payments", getPayments);



export default teacherRouter;