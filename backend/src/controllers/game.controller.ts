import type { NextFunction, Request, Response } from "express";
import * as gameService from "../services/game.service.js";
import { searchGames } from "../services/rawg.service.js";
import { NotFoundError } from "../utils/errors.js";
import {
  createGameSchema,
  idParamSchema,
  listGamesQuerySchema,
  searchQuerySchema,
  updateGameSchema,
} from "../schemas/game.schema.js";

export const listGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, pageSize } = listGamesQuerySchema.parse(req.query);
    const games = await gameService.listGames({ page, pageSize });
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
    const { id } = idParamSchema.parse(req.params);
    const game = await gameService.getGameById(id);

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
    const data = createGameSchema.parse(req.body);
    const game = await gameService.createGame(data);
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
    const { id } = idParamSchema.parse(req.params);
    const data = updateGameSchema.parse(req.body);
    const game = await gameService.updateGame(id, data);
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
    const { id } = idParamSchema.parse(req.params);
    await gameService.deleteGame(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const getFeaturedGames = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const games = await gameService.getFeaturedGames();
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
