import { describe, expect, it } from "vitest";
import {
  assertRatingAllowedForStatus,
  normalizeReleaseDate,
  trimIfString,
} from "./game.service.js";
import { ValidationError } from "../utils/errors.js";

describe("assertRatingAllowedForStatus", () => {
  it("rejeita nota quando o status é QUERO_JOGAR", () => {
    expect(() => assertRatingAllowedForStatus("QUERO_JOGAR", 8)).toThrow(
      ValidationError,
    );
  });

  it("permite QUERO_JOGAR sem nota", () => {
    expect(() =>
      assertRatingAllowedForStatus("QUERO_JOGAR", null),
    ).not.toThrow();
    expect(() =>
      assertRatingAllowedForStatus("QUERO_JOGAR", undefined),
    ).not.toThrow();
  });

  it("permite nota para JOGANDO e ZERADO", () => {
    expect(() => assertRatingAllowedForStatus("JOGANDO", 7)).not.toThrow();
    expect(() => assertRatingAllowedForStatus("ZERADO", 10)).not.toThrow();
  });
});

describe("trimIfString", () => {
  it("remove espaços das extremidades", () => {
    expect(trimIfString("  Hades  ")).toBe("Hades");
  });

  it("mantém undefined intacto", () => {
    expect(trimIfString(undefined)).toBeUndefined();
  });
});

describe("normalizeReleaseDate", () => {
  it("mantém undefined quando o campo não foi enviado", () => {
    expect(normalizeReleaseDate(undefined)).toBeUndefined();
  });

  it("converte string vazia ou nula em null", () => {
    expect(normalizeReleaseDate(null)).toBeNull();
    expect(normalizeReleaseDate("")).toBeNull();
  });

  it("converte string de data válida em Date", () => {
    const result = normalizeReleaseDate("2023-08-03");
    expect(result).toBeInstanceOf(Date);
  });
});
