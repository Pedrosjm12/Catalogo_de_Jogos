import { z } from "zod";

export const gameStatusSchema = z.enum(["JOGANDO", "ZERADO", "QUERO_JOGAR"], {
  errorMap: () => ({
    message: "Status inválido. Use: JOGANDO, ZERADO ou QUERO_JOGAR.",
  }),
});

export const createGameSchema = z.object({
  title: z.string().trim().min(1, "O título do jogo é obrigatório."),
  platform: z.string().trim().min(1, "A plataforma do jogo é obrigatória."),
  developer: z
    .string()
    .trim()
    .min(1, "A desenvolvedora do jogo é obrigatória."),
  status: gameStatusSchema,
  favorite: z.boolean().optional(),
  rating: z
    .number({ invalid_type_error: "A nota deve ser um número." })
    .min(0, "A nota deve estar entre 0 e 10.")
    .max(10, "A nota deve estar entre 0 e 10.")
    .nullable()
    .optional(),
  releaseDate: z
    .union([z.string(), z.date()])
    .nullable()
    .optional(),
  coverUrl: z.string().nullable().optional(),
});

export const updateGameSchema = createGameSchema.partial();

export const idParamSchema = z.object({
  id: z.string().uuid("Identificador inválido."),
});

export const listGamesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
});

export type CreateGamePayload = z.infer<typeof createGameSchema>;
export type UpdateGamePayload = z.infer<typeof updateGameSchema>;
export type GameStatus = z.infer<typeof gameStatusSchema>;
