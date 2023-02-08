import { Router } from "express";
import { insertCustomers, listCustomerById, listCustomers, updateCustomer } from "../controllers/Customers.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { customersSchema, customersUpdateSchema } from "../schemas/PostsSchema.js";

const customersRouter = Router();

customersRouter.get('/customers', listCustomers);
customersRouter.get('/customers/:id', listCustomerById);
customersRouter.post('/customers', validateSchema(customersSchema), insertCustomers);
customersRouter.put('/customers/:id', validateSchema(customersUpdateSchema), updateCustomer);

export default customersRouter;