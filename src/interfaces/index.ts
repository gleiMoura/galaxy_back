export interface loginType {
    email: string,
    password: string
};

export interface registerType {
    name: string,
    profileUrl?: string,
    email: string,
    password: string
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