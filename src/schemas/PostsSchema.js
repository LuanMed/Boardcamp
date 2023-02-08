import Joi from "joi";

export const customersSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(11).required(),
    cpf: Joi.string().pattern(/^[0-9]+$/).length(11).required(),
    birthday: Joi.date().required()
});

export const customersUpdateSchema = Joi.object({
    name: Joi.string(),
    phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(11),
    cpf: Joi.string().pattern(/^[0-9]+$/).length(11),
    birthday: Joi.date()
});

export const gamesSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    stockTotal: Joi.number().integer().required(),
    pricePerDay: Joi.number().required()
});

export const rentalsSchema = Joi.object({
    customersId: Joi.number().positive().integer().required(),
    gameId: Joi.number().positive().integer().required(),
    daysRented: Joi.number().integer().required()
});