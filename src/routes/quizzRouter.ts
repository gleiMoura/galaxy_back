import { Router } from "express";
import { deleteQuizz, doQuizz, getQuizzById, sendAllQuizzes, sendUserQuizzes } from "../controllers/quizzController.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import quizzSchema from "../schemas/quizSchema.js";

const quizzRouter = Router();
quizzRouter.post("/quizz", schemaValidator(quizzSchema), doQuizz);
quizzRouter.get("/quizz", sendAllQuizzes);
quizzRouter.get("/quizz/user", sendUserQuizzes);
quizzRouter.delete("/quizz/:id", deleteQuizz);
quizzRouter.get("/quizz/:id", getQuizzById);


export default quizzRouter;