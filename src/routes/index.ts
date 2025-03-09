import Router from "express";
import loginRouter from "./loginRouter.js";
import registerRouter from "./registerRouter.js";
import studentRouter from "./studentRouter.js";
import contractRouter from "./contractRouter.js";
import classesRouter from "./classesRoutes.js";
import teacherRouter from "./teacherRouter.js";

const router = Router();
router.use(loginRouter);
router.use(registerRouter);
router.use(studentRouter);
router.use(teacherRouter)
router.use(contractRouter);
router.use(classesRouter);

export default router;