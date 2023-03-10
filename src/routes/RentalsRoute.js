import { Router } from "express";
import { deleteRental, insertRentals, listRentals, returnRental } from "../controllers/Rentals.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { rentalsSchema } from "../schemas/PostsSchema.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', listRentals);
rentalsRouter.post('/rentals', validateSchema(rentalsSchema), insertRentals);
rentalsRouter.post('/rentals/:id/return', returnRental);
rentalsRouter.delete('/rentals/:id', deleteRental);

export default rentalsRouter;