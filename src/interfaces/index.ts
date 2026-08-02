import { Request } from "express";

import { JwtPayload } from "jsonwebtoken";
export interface loginType {
    email: string,
    password: string
};

export interface StudentInterestInput {
    subject: string;
}

export interface studentRegisterType {
    name: string;
    guardianName?: string | null;
    phone?: string | null;
    guardianPhone?: string | null;
    shortTermGoal?: string | null;
    longTermGoal?: string | null;
    schoolYear: number;
    interests: StudentInterestInput[]; // Array de objetos para criação em cascata no Prisma
    role?: "student";
    email: string;
    password: string;
    profileUrl?: string;
}
export interface studentType {
    id?: number;
    name?: string;
    guardianName?: string;
    phone?: string;
    guardianPhone?: string;
    shortTermGoal?: string;
    longTermGoal?: string;
    schoolYear?: number;
    interests?: string;
    role?: string;
}

export interface teacherRegisterType {
    name: string;
    subject: string;
    academicDegree: string;
    funFactOne?: string | null;
    funFactTwo?: string | null;
    email: string;
    password: string;
    role?: "teacher";
    profileUrl?: string;
    cpf: string;
    phone: string;
}
export interface CustomError extends Error {
    response?: {
        status: number;
        message: string;
    };
};

export interface Options {
    option1: string;
    option2?: string;
    option3?: string;
};

interface Question {
    title: string;
    options: Options;
};

interface RightOptions {
    firstQuestion: string;
    secondQuestion?: string;
    thirdQuestion?: string;
}
interface Answers {
    oneRight: string;
    twoRight?: string;
    threeRight?: string;
}
export interface QuizzType {
    title: string;
    firstQuestion: Question;
    secondQuestion?: Question;
    thirdQuestion?: Question;
    rightOptions: RightOptions;
    answers: Answers;
};

export interface PostType {
    userId: string,
    caption: string;
    photo: string
}

export interface TeacherType {
    id?: number,
    name: string;
    subject: string;
    funFactOne?: string;
    funFactTwo?: string;
    academicDegree?: string;
    email: string;
    password?: string;
    role?: string;
    profileUrl?: string
};

export type ContractType = {
    id?: number;
    startDate: Date;
    endDate: Date;
    lessonsPerWeek: number;
    usedLessons?: number;
    contractTotalLessons: number;
    firstMonthLessons: number;
    secondMonthLessons: number;
    thirdMonthLessons: number;
    signed: boolean;
    planId: number;
    studentId: number;
    teacherId?: number | null;
    student?: studentType,
    teacher?: TeacherType
};

export type ClassType = {
    id?: number;
    studentId: string;
    title: string;
    subject: string;
    sentAt: Date;
    pdfUrl: string;
};

declare module "express-serve-static-core" {
    export interface Request {
        user?: {
            id: number;
            role: string;
            email: string;
        };
    }
}

// Define o tipo completo que espelha o modelo Admin no Prisma
export interface AdminType {
    id: number;
    name: string;
    function: string;
    email: string;
    password: string; // Opcional ao retornar dados em respostas HTTP para omitir o hash
    role: "admin";
    profileUrl: string;
}

// DTO para o payload de cadastro de um novo Administrador
export type AdminCreateInput = Omit<AdminType, "id">;

// Payload utilizado na geração de Tokens de Autenticação (JWT)
export type AdminTokenPayload = Pick<AdminType, "id" | "name" | "email" | "role">;

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Usa a interface customizada
    }
  }
}