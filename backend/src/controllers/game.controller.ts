import type { NextFunction, Request, Response } from "express";
import * as gameService from "../services/game.service.js";
import { searchGames } from "../services/rawg.service.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import {
  createGameSchema,
  idParamSchema,
  listGamesQuerySchema,
  searchQuerySchema,
  updateGameSchema,
} from "../schemas/game.schema.js";

const requireUserId = (req: Request): string => {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  return req.userId;
};

export const listGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = requireUserId(req);
    const { page, pageSize } = listGamesQuerySchema.parse(req.query);
    const games = await gameService.listGames(userId, { page, pageSize });
    return res.status(200).json(games);
  } catch (error) {
    return next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = requireUserId(req);
    const { id } = idParamSchema.parse(req.params);
    const game = await gameService.getGameById(userId, id);

    if (!game) {
      throw new NotFoundError("Jogo não encontrado.");
    }

    return res.status(200).json(game);
  } catch (error) {
    return next(error);
  }
};

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = requireUserId(req);
    const data = createGameSchema.parse(req.body);
    const game = await gameService.createGame(userId, data);
    return res.status(201).json(game);
  } catch (error) {
    return next(error);
  }
};

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = requireUserId(req);
    const { id } = idParamSchema.parse(req.params);
    const data = updateGameSchema.parse(req.body);
    const game = await gameService.updateGame(userId, id, data);
    return res.status(200).json(game);
  } catch (error) {
    return next(error);
  }
};

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = requireUserId(req);
    const { id } = idParamSchema.parse(req.params);
    await gameService.deleteGame(userId, id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const getFeaturedGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = requireUserId(req);
    const games = await gameService.getFeaturedGames(userId);
    return res.status(200).json(games);
  } catch (error) {
    return next(error);
  }
};

export const searchGameSuggestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    requireUserId(req);
    const { q } = searchQuerySchema.parse(req.query);

    if (!q) {
      return res.status(200).json([]);
    }

    const suggestions = await searchGames(q);
    return res.status(200).json(suggestions);
  } catch (error) {
    return next(error);
  }
};
