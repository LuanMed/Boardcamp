import { db } from "../config/database.connection.js"

export async function listGames (req, res) {
    try {
        const games = await db.query("SELECT * FROM games");

        res.send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function insertGames (req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    if (stockTotal <= 0 || pricePerDay <= 0) return res.status(400).send("Valor deve ser maior que 0");

    try {
        const nameExist = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if (nameExist.rows.length !== 0) return res.status(409).send("Já existe um jogo com esse nome");
        console.log(nameExist.rows)
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay]);
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}