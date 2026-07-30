import { Router } from "express";
import multer from "multer";
import {
  registerStudent,
  registerTeacher,
  registerAdmin,
  insertProfileImage,
} from "../controllers/registerController";
import schemaValidator from "../middlewares/schemaValidator";
import tokenValidator from "../middlewares/tokenValidator";
import schemas from "../schemas";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

const registerRouter = Router();

registerRouter.post(
  "/register/teacher",
  schemaValidator(schemas.teacherRegisterSchema),
  registerTeacher
);

registerRouter.post(
  "/register/student",
  schemaValidator(schemas.studentRegisterSchema),
  registerStudent
);

registerRouter.post(
  "/register/admin",
  schemaValidator(schemas.adminRegisterSchema),
  registerAdmin
);

registerRouter.put(
  "/register/profile",
  tokenValidator,
  upload.single("file"),
  insertProfileImage
);

export default registerRouter;