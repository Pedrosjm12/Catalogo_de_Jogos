import { Router } from "express";
import {
  listGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getFeaturedGames,
  searchGameSuggestions,
} from "../controllers/game.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/games", listGames);
router.get("/games/search", searchGameSuggestions);
router.get("/games/featured", getFeaturedGames);
router.get("/games/:id", getGameById);
router.post("/games", createGame);
router.put("/games/:id", updateGame);
router.delete("/games/:id", deleteGame);

export default router;
