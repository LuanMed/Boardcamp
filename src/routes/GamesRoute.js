import { Router } from "express";
import { insertGames, listGames } from "../controllers/Games.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { gamesSchema } from "../schemas/PostsSchema.js";

const gamesRouter = Router();

gamesRouter.get('/games', listGames);
gamesRouter.post('/games', validateSchema(gamesSchema), insertGames);

export default gamesRouter;