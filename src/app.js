import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import joi from 'joi';
import dotenv from "dotenv";

const app = express();
app.listen(5000, console.log("servidor iniciado na porta 5000"))
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoCilent = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoCilent.connect()
} catch (err) {
    console.log(err.message);
}
const db = mongoCilent.db()