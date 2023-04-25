import { transactionSchema } from "../schemas/transactions.schemas.js"


export function validateSchema(req, res, next){
    const validation = transactionSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }
    next();
}