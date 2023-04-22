import { Router } from "express"
import { getTransaction, postTransaction } from "../controllers/transactionsController.js"


const transactionRouter = Router()

transactionRouter.post("/transaction", postTransaction)

transactionRouter.get("/transaction", getTransaction)

export default transactionRouter