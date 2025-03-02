import { createClass } from "controllers/classController";
import { Router } from "express";
import tokenValidator from "middlewares/tokenValidator";

const classesRouter = Router();

classesRouter.post('/student/class', tokenValidator, createClass);
//classesRouter.get('/student/class', getClass);
//classesRouter.get('/student/classes', getClasses);

export default classesRouter;