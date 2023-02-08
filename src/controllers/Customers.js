import { db } from "../config/database.connection.js"

export async function listCustomers (req, res) {
    try {
        const customers = await db.query("SELECT * FROM customers");

        res.send(customers.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function listCustomerById (req, res) {
    const { id } = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = ${id}`);
        if(customer.rows.length === 0) return res.status(404).send("ID não existe");
        res.send(customer.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function insertCustomers (req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const cpfExist = await db.query(`SELECT * FROM customers WHERE cpf = '${cpf}'`);
        if (cpfExist.rows.length !== 0) return res.status(409).send("Esse CPF já foi cadastrado");

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${name}', ${phone}, ${cpf}, '${birthday}');`);
        
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateCustomer (req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {
        const idExist = await db.query(`SELECT * FROM customers WHERE id = ${id}`);
        if(idExist.rows.length === 0) return res.status(404).send("ID não existe");

        const cpfExist = await db.query(`SELECT * FROM customers WHERE cpf = '${cpf}' and id <> '${id}'`);
        if (cpfExist.rows.length !== 0) return res.status(409).send("Esse CPF já foi cadastrado");
        console.log(cpfExist.rows)

        await db.query(`UPDATE customers SET name='${name}', phone=${phone}, cpf=${cpf}, birthday='${birthday}' WHERE id = ${id}`);
        
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}