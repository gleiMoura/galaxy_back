import { Request, Response, NextFunction } from "express";
import { generateFileLink } from "../repository/filesRepository";
import {
  registerStudentService,
  registerTeacherService,
  registerAdminService,
  logUserWithProfileLink,
} from "../services/registerService";

// Interface estendida para o Request com autenticação JWT
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const registerStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = await registerStudentService(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// 2. Cadastro de Professor
export const registerTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teacher = await registerTeacherService(req.body);
    res.status(201).json({ id: teacher.id, email: teacher.email });
  } catch (error) {
    next(error);
  }
};

// 3. Cadastro de Administrador
export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admin = await registerAdminService(req.body);
    res.status(201).json({ id: admin.id, email: admin.email });
  } catch (error) {
    next(error);
  }
};

// 4. Upload de Foto de Perfil no Google Cloud Storage
export const insertProfileImage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file;
    const userEmail = req.user?.email;

    if (!file) {
      res.status(400).json({ message: "É necessário enviar um arquivo de imagem." });
      return;
    }

    if (!userEmail) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const fileLink = await generateFileLink(file);
    const profile = await logUserWithProfileLink(userEmail, fileLink);

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};