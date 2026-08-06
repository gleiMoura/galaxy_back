import { createClass, getClass, getClasses } from "../controllers/classController";
import { Router } from "express";
import tokenValidator from "../middlewares/tokenValidator";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

const classesRouter = Router();

classesRouter.post('/class', tokenValidator, upload.single('file'), createClass);
classesRouter.get('/class/:id', getClass);
classesRouter.get('/classes', tokenValidator, getClasses);

export default classesRouter;