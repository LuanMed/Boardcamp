import { db } from "../config/database.connection.js";

export async function listRentals (req, res) {
    try {
        const rentals = await db.query("SELECT * FROM rentals");

        res.send(rentals.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}