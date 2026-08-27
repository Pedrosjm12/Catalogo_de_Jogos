import prisma from "../config/prisma.js";
import { ConflictError, UnauthorizedError } from "../utils/errors.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import type { LoginPayload, RegisterPayload } from "../schemas/auth.schema.js";

export type SafeUser = {
  id: string;
  username: string;
  email: string;
};

const toSafeUser = (user: {
  id: string;
  username: string;
  email: string;
}): SafeUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
});

export const register = async (data: RegisterPayload): Promise<SafeUser> => {
  const existingByEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingByEmail) {
    throw new ConflictError("Este e-mail já está em uso.");
  }

  const existingByUsername = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingByUsername) {
    throw new ConflictError("Este nome de usuário já está em uso.");
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
    },
  });

  return toSafeUser(user);
};

export const login = async (data: LoginPayload): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw new UnauthorizedError("E-mail ou senha inválidos.");
  }

  const passwordMatches = await comparePassword(
    data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new UnauthorizedError("E-mail ou senha inválidos.");
  }

  return toSafeUser(user);
};

export const getUserById = async (id: string): Promise<SafeUser | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toSafeUser(user) : null;
};
