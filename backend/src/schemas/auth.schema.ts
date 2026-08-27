import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "O nome de usuário deve ter pelo menos 3 caracteres.")
  .max(30, "O nome de usuário deve ter no máximo 30 caracteres.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "O nome de usuário só pode conter letras, números e underscore.",
  );

const emailSchema = z
  .string()
  .trim()
  .min(1, "O e-mail é obrigatório.")
  .email("Informe um e-mail válido.");

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra.")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número.");

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "A senha é obrigatória."),
});

export type RegisterPayload = z.infer<typeof registerSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
