import { Router } from "express"
import { getTransaction, postTransaction } from "../controllers/transactionsController.js" 
import { authValidation } from "../middlewares/auth.middleware.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { transactionSchema } from "../schemas/transactions.schemas.js"

const transactionRouter = Router()

transactionRouter.post("/transaction",authValidation,validateSchema(transactionSchema), postTransaction)

transactionRouter.get("/transaction",authValidation, getTransaction)

export default transactionRouter