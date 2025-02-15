import Router from "express";
import loginRouter from "./loginRouter.js";
import registerRouter from "./registerRouter.js";
import studentRouter from "./studentRouter.js";
import contractRouter from "./contractRouter.js";

const router = Router();
router.use(loginRouter);
router.use(registerRouter);
router.use(studentRouter)
router.use(contractRouter)

export default router;