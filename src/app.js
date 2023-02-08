import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import customersRouter from "./routes/CustomersRoute.js";
import gamesRouter from "./routes/GamesRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use([customersRouter, gamesRouter]);

app.listen(process.env.PORT, () => console.log(`Servidor rodou na porta: ${process.env.PORT}`));