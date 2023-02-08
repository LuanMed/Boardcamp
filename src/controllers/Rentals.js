import { db } from "../config/database.connection.js";
import dayjs from "dayjs";

export async function listRentals (req, res) {
    try {
        const rentals = await db.query("SELECT * FROM rentals");

        res.send(rentals.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function insertRentals (req, res) {
    const { customerId, gameId, daysRented } = req.body;

    if (daysRented <= 0) return res.status(400).send("Valor deve ser maior que 0");

    try {

        const customerExist = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        if (customerExist.rows.length === 0) return res.status(400).send("Cliente não foi encontrado");
        const gameExist = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
        if (gameExist.rows.length === 0) return res.status(400).send("Jogo não foi encontrado");
        
        const rentDate = dayjs();
        const originalPrice = daysRented * gameExist.rows[0].pricePerDay;

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") VALUES ($1, $2, $3, $4, $5);`, [customerId, gameId, daysRented, rentDate, originalPrice]);
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}