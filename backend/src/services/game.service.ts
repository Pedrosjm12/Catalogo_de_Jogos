import prisma from "../config/prisma.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import type {
  CreateGamePayload,
  UpdateGamePayload,
} from "../schemas/game.schema.js";

export type ListGamesOptions = {
  page?: number;
  pageSize?: number;
};

export const assertRatingAllowedForStatus = (
  status: string,
  rating: number | null | undefined,
) => {
  if (status === "QUERO_JOGAR" && rating !== null && rating !== undefined) {
    throw new ValidationError(
      "Jogos com status QUERO_JOGAR não podem receber nota.",
    );
  }
};

export const trimIfString = (value?: string) =>
  typeof value === "string" ? value.trim() : value;

export const normalizeReleaseDate = (
  releaseDate: string | Date | null | undefined,
): Date | null | undefined => {
  if (releaseDate === undefined) return undefined;
  return releaseDate ? new Date(releaseDate) : null;
};

export const listGames = async (
  userId: string,
  { page, pageSize }: ListGamesOptions = {},
) => {
  const shouldPaginate = Boolean(page && pageSize);

  return prisma.game.findMany({
    where: { userId },
    orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
    ...(shouldPaginate ? { skip: (page! - 1) * pageSize!, take: pageSize } : {}),
  });
};

export const getGameById = async (userId: string, id: string) => {
  return prisma.game.findFirst({ where: { id, userId } });
};

export const createGame = async (
  userId: string,
  data: CreateGamePayload,
) => {
  assertRatingAllowedForStatus(data.status, data.rating);

  return prisma.game.create({
    data: {
      title: data.title.trim(),
      platform: data.platform.trim(),
      developer: data.developer.trim(),
      status: data.status,
      favorite: data.favorite ?? false,
      rating: data.rating ?? null,
      releaseDate: normalizeReleaseDate(data.releaseDate) ?? null,
      coverUrl: data.coverUrl ?? null,
      userId,
    },
  });
};

export const updateGame = async (
  userId: string,
  id: string,
  data: UpdateGamePayload,
) => {
  const existingGame = await prisma.game.findFirst({ where: { id, userId } });

  if (!existingGame) {
    throw new NotFoundError("Jogo não encontrado.");
  }

  const nextStatus = data.status ?? existingGame.status;
  const nextRating =
    data.rating !== undefined ? data.rating : existingGame.rating;

  assertRatingAllowedForStatus(nextStatus, nextRating);

  return prisma.game.update({
    where: { id },
    data: {
      ...data,
      title: trimIfString(data.title),
      platform: trimIfString(data.platform),
      developer: trimIfString(data.developer),
      releaseDate: normalizeReleaseDate(data.releaseDate),
    },
  });
};

export const deleteGame = async (userId: string, id: string) => {
  const existingGame = await prisma.game.findFirst({ where: { id, userId } });

  if (!existingGame) {
    throw new NotFoundError("Jogo não encontrado.");
  }

  return prisma.game.delete({ where: { id } });
};

export const getFeaturedGames = async (userId: string) => {
  return prisma.game.findMany({
    where: {
      userId,
      OR: [{ favorite: true }, { rating: { not: null } }],
    },
    orderBy: [
      { favorite: "desc" },
      { rating: "desc" },
      { releaseDate: "desc" },
    ],
    take: 10,
  });
};
