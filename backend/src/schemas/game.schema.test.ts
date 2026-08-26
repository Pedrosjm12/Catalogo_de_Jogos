import { describe, expect, it } from "vitest";
import {
  createGameSchema,
  idParamSchema,
  listGamesQuerySchema,
} from "./game.schema.js";

describe("createGameSchema", () => {
  const basePayload = {
    title: "Hollow Knight",
    platform: "PC",
    developer: "Team Cherry",
    status: "ZERADO" as const,
  };

  it("aceita um payload válido", () => {
    const result = createGameSchema.parse(basePayload);
    expect(result.title).toBe("Hollow Knight");
  });

  it("rejeita título vazio", () => {
    expect(() => createGameSchema.parse({ ...basePayload, title: "  " })).toThrow();
  });

  it("rejeita status inválido", () => {
    expect(() =>
      createGameSchema.parse({ ...basePayload, status: "PLATINADO" }),
    ).toThrow();
  });

  it("rejeita nota fora do intervalo 0-10", () => {
    expect(() =>
      createGameSchema.parse({ ...basePayload, rating: 15 }),
    ).toThrow();
    expect(() =>
      createGameSchema.parse({ ...basePayload, rating: -1 }),
    ).toThrow();
  });
});

describe("idParamSchema", () => {
  it("rejeita identificadores que não são uuid", () => {
    expect(() => idParamSchema.parse({ id: "123" })).toThrow();
  });

  it("aceita um uuid válido", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    expect(idParamSchema.parse({ id })).toEqual({ id });
  });
});

describe("listGamesQuerySchema", () => {
  it("aceita query vazia sem paginação", () => {
    expect(listGamesQuerySchema.parse({})).toEqual({});
  });

  it("converte page e pageSize de string para número", () => {
    expect(listGamesQuerySchema.parse({ page: "2", pageSize: "10" })).toEqual({
      page: 2,
      pageSize: 10,
    });
  });

  it("rejeita pageSize acima do limite", () => {
    expect(() => listGamesQuerySchema.parse({ pageSize: "500" })).toThrow();
  });
});
