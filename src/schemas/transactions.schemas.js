import joi from "joi"

export const transactionSchema = joi.object({
    valor: joi.number().positive().precision(2).required(),
    descricao: joi.string().required(),
    tipo: joi.string().valid("saida","entrada").required()
})