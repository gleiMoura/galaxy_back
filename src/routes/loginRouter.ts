import { doLogin } from "../controllers/loginController.js";
import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import schemas from "../schemas/index.js";

const loginRouter = Router();
loginRouter.post("/login", schemaValidator(schemas.loginSchema), doLogin);

export default loginRouter;