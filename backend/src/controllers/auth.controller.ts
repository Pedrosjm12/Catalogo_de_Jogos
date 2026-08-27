import type { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { signToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../utils/errors.js";
import {
  SESSION_COOKIE_MAX_AGE_MS,
  SESSION_COOKIE_NAME,
} from "../utils/cookies.js";

const isProduction = process.env.NODE_ENV === "production";

const setSessionCookie = (res: Response, userId: string) => {
  const token = signToken({ sub: userId });

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE_MS,
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);
    setSessionCookie(res, user.id);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await authService.login(data);
    setSessionCookie(res, user.id);
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE_NAME);
  return res.status(204).send();
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new UnauthorizedError();
    }

    const user = await authService.getUserById(req.userId);

    if (!user) {
      throw new UnauthorizedError();
    }

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
