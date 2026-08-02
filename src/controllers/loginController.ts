import { Request, Response, NextFunction } from "express";
import { signinUser } from "../services/loginService.js";

export const doLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const credentials = req.body;
    const userInformation = await signinUser(credentials);

    res.status(200).json(userInformation);
  } catch (error) {
    next(error);
  }
};