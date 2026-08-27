import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors.js";
import { verifyToken } from "../utils/jwt.js";
import { SESSION_COOKIE_NAME } from "../utils/cookies.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedError("Não autenticado.");
    }

    const payload = verifyToken(token);
    req.userId = payload.sub;
    return next();
  } catch {
    return next(new UnauthorizedError("Sessão inválida ou expirada."));
  }
};
