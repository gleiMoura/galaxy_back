import { doRegister, insertProfileImage } from "../controllers/registerController.js";
import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import authenticateToken from "middlewares/tokenValidator.js";
import registerSchemaStudent from "../schemas/studentRegisterSchema.js";
import registerSchemaTeacher from "../schemas/teacherRegisterSchema.js";
import multer from "multer"

const upload = multer({ dest: 'uploads/' });

const registerRouter = Router();

registerRouter.post('/register/teacher', schemaValidator(registerSchemaTeacher), doRegister);
registerRouter.post('/register/student', schemaValidator(registerSchemaStudent), doRegister);
//registerRouter.post('/register/admin', schemaValidator(), doRegister);
registerRouter.put('/register/profile', authenticateToken, upload.single('file'), insertProfileImage)

export default registerRouter;