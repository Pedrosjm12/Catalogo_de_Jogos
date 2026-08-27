import jwt from "jsonwebtoken";

export type TokenPayload = {
  sub: string;
};

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado.");
  }

  return secret;
};

export const signToken = (payload: TokenPayload): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

  return jwt.sign(payload, getSecret(), {
    expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, getSecret()) as TokenPayload;
};
