import { doLogin } from "../controllers/loginController.js";
import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import loginSchema from "../schemas/loginSchema.js";

const loginRouter = Router();
loginRouter.post("/login", schemaValidator(loginSchema), doLogin);

export default loginRouter;