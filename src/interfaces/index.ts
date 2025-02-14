import { Request } from "express";
export interface loginType {
    email: string,
    password: string
};

export interface studentRegisterType {
    name: string;
    guardianName: string;
    phone: string;
    guardianPhone: string;
    shortTermGoal: string;
    longTermGoal: string;
    schoolYear: number;
    interests: string;
    role?: string;
    email: string;
    password: string;
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
    name: string,
    profileUrl?: string,
    email: string,
    password: string,
    role: string
};
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
    name: string;
    subject: string;
    funFactOne?: string;
    funFactTwo?: string;
    academicDegree: string;
    email: string;
    password: string;
    role?: string;
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