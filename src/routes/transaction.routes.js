import { Router } from "express"
import { getTransaction, postTransaction } from "../controllers/transactionsController.js" 
import { validateSchema } from "../middlewares/validateSchema.middleware.js"


const transactionRouter = Router()

transactionRouter.post("/transaction",validateSchema, postTransaction)

transactionRouter.get("/transaction", getTransaction)

export default transactionRouter