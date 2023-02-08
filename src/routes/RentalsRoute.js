import { Router } from "express";
import { listRentals } from "../controllers/Rentals.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', listRentals);

export default rentalsRouter;