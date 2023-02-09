import { db } from "../config/database.connection.js";
import dayjs from "dayjs";

export async function listRentals(req, res) {
    try {
        const rentals = await db.query(`SELECT * FROM rentals;`);

        //const customers = await db.query(`SELECT rentals.*, customers.name, customers.id FROM rentals RIGHT JOIN customers ON rentals."customerId" = customers.id`);
        //const games = await db.query(`SELECT rentals.*, games.name, games.id FROM rentals RIGHT JOIN customers ON rentals."gameId" = game.id`);
        //console.log(customers.rows)
        // const rentals = await db.query(`SELECT * FROM rentals;`);
        // const listRentals = rentals.rows.map()

        const customers = [];
        const games = [];
        for (let i = 0; i < rentals.rows.length; i++) {
            customers.push((await db.query(`SELECT customers.id, customers.name FROM customers WHERE id = $1`, [rentals.rows[i].customerId])).rows[0]);
            games.push((await db.query(`SELECT games.id, games.name FROM games WHERE id = $1`, [rentals.rows[i].gameId])).rows[0]);
        }
        console.log(customers);
        console.log(games);
        //const game = (await db.query(`SELECT games.id, games.name FROM games WHERE id = $1`, [rentals.rows[0].gameId])).rows[0];
        // console.log(game)

        for (let i = 0; i < rentals.rows.length; i++) {
            rentals.rows[i].customer = customers[i];
            rentals.rows[i].game = games[i];
        }

        const returnDate = dayjs();
        const aux = returnDate - rentals.rows[0].rentDate;
        console.log(aux)
        console.log(returnDate.$d)

        res.send(rentals.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function insertRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;


    if (daysRented <= 0) return res.status(400).send("Valor deve ser maior que 0");

    try {

        const customerExist = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        if (customerExist.rows.length === 0) return res.status(400).send("Cliente não foi encontrado");

        const gameExist = await db.query('SELECT * FROM games WHERE id = $1', [gameId]);
        if (gameExist.rows.length === 0) return res.status(400).send("Jogo não foi encontrado");

        const rentalsForThisGame = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1`, [gameExist.rows[0].id]);
        if (rentalsForThisGame.rows.length >= gameExist.rows[0].stockTotal) return res.status(400).send("Jogo está em falta no estoque");

        const rentDate = dayjs();
        const originalPrice = daysRented * gameExist.rows[0].pricePerDay;

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") VALUES ($1, $2, $3, $4, $5);`, [customerId, gameId, daysRented, rentDate, originalPrice]);

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function returnRental(req, res) {
    const { id } = req.params;
    const returnDate = dayjs();
    let delayFee = 0;

    try {
        const rental = await db.query('SELECT * FROM rentals WHERE id = $1;', [id]);
        //if (rental.rows.length === 0) return res.status(404).send("Aluguel não existe");
        //if (rental.rows[0].returnDate) return res.status(400).send("Aluguel já foi finalizado");

        const daysUsed = parseInt((returnDate.$d - rental.rows[0].rentDate) / 86400000);
        console.log(returnDate.$d);

        console.log(rental.rows[0].rentDate);
        console.log((returnDate.$d - rental.rows[0].rentDate));
        console.log(daysUsed);

        if (daysUsed > rental.rows[0].daysRented) delayFee = (daysUsed - rental.rows[0].daysRented) * (rental.rows[0].originalPrice / rental.rows[0].daysRented);

        await db.query(`UPDATE rentals SET "returnDate"= $1, "delayFee"= $2 WHERE id = $3;`, [returnDate.$d, delayFee, id]);

        res.sendStatus(200);

    } catch (error) {
        res.status(500).send(error.message);
    }
}