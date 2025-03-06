import { doRegister, insertProfileImage } from "../controllers/registerController.js";
import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import tokenValidator from "middlewares/tokenValidator.js";
import schemas from "schemas/index.js";
import multer from "multer"

const upload = multer({ dest: 'uploads/' });

const registerRouter = Router();

registerRouter.post('/register/teacher', schemaValidator(schemas.teacherRegisterSchema), doRegister);
registerRouter.post('/register/student', schemaValidator(schemas.studentRegisterSchema), doRegister);
registerRouter.post('/register/admin', schemaValidator(schemas.adminRegisterSchema), doRegister);
registerRouter.put('/register/profile', tokenValidator, upload.single('file'), insertProfileImage)

export default registerRouter;