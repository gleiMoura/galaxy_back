import { Router } from "express";
import multer from "multer";
import { doRegister, insertProfileImage } from "../controllers/registerController";
import schemaValidator from "../middlewares/schemaValidator";
import tokenValidator from "../middlewares/tokenValidator";
import schemas from "../schemas";

// Configuração para manter a foto em memória e enviá-la para o Google Cloud Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por foto de perfil
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos de imagem são permitidos."));
    }
  },
});

const registerRouter = Router();

// Rotas de cadastro com validação de Schema (Joi/Zod)
registerRouter.post(
  "/register/teacher",
  schemaValidator(schemas.teacherRegisterSchema),
  doRegister
);

registerRouter.post(
  "/register/student",
  schemaValidator(schemas.studentRegisterSchema),
  doRegister
);

registerRouter.post(
  "/register/admin",
  schemaValidator(schemas.adminRegisterSchema),
  doRegister
);

// Rota de foto de perfil autenticada
registerRouter.put(
  "/register/profile",
  tokenValidator,
  upload.single("file"),
  insertProfileImage
);

export default registerRouter;