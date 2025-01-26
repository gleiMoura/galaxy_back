import Router from "express";
import loginRouter from "./loginRouter.js";
import registerRouter from "./registerRouter.js";
import quizzRouter from "./quizzRouter.js";
import postsRouter from "./postsRouter.js";


const router = Router();
router.use(loginRouter);
router.use(registerRouter);
router.use(quizzRouter);
router.use(postsRouter)

export default router;