import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth.schema.js";

describe("registerSchema", () => {
  const basePayload = {
    username: "gamer_pro",
    email: "gamer@example.com",
    password: "Senha123",
  };

  it("aceita um cadastro válido", () => {
    expect(registerSchema.parse(basePayload)).toEqual(basePayload);
  });

  it("rejeita nome de usuário com caracteres inválidos", () => {
    expect(() =>
      registerSchema.parse({ ...basePayload, username: "gamer pro!" }),
    ).toThrow();
  });

  it("rejeita nome de usuário curto demais", () => {
    expect(() =>
      registerSchema.parse({ ...basePayload, username: "ab" }),
    ).toThrow();
  });

  it("rejeita e-mail inválido", () => {
    expect(() =>
      registerSchema.parse({ ...basePayload, email: "nao-e-email" }),
    ).toThrow();
  });

  it("rejeita senha curta", () => {
    expect(() =>
      registerSchema.parse({ ...basePayload, password: "abc123" }),
    ).toThrow();
  });

  it("rejeita senha sem número", () => {
    expect(() =>
      registerSchema.parse({ ...basePayload, password: "somenteletras" }),
    ).toThrow();
  });

  it("rejeita senha sem letra", () => {
    expect(() =>
      registerSchema.parse({ ...basePayload, password: "12345678" }),
    ).toThrow();
  });
});

describe("loginSchema", () => {
  it("aceita e-mail e senha preenchidos", () => {
    expect(
      loginSchema.parse({ email: "gamer@example.com", password: "qualquer" }),
    ).toEqual({ email: "gamer@example.com", password: "qualquer" });
  });

  it("rejeita senha vazia", () => {
    expect(() =>
      loginSchema.parse({ email: "gamer@example.com", password: "" }),
    ).toThrow();
  });
});
