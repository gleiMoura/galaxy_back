import Router from "express";
import loginRouter from "./loginRouter.js";
import registerRouter from "./registerRouter.js";

const router = Router();
router.use(loginRouter);
router.use(registerRouter);

export default router;