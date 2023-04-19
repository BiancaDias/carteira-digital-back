import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import joi from 'joi';
import dotenv from "dotenv";
import bcrypt from "bcrypt";

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

const usuarioSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(3)
})


app.post("/cadastro", async (req, res) => {
    const { name, email, password } = req.body;
    const validation = usuarioSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.path);
        return res.status(422).send(errors);
    }
    const hash = bcrypt.hashSync(password, 10);
    try{
        const verificaSePossuiCadastro = await db.collection("cadastrados").findOne({email})
        if(verificaSePossuiCadastro){
            return res.status(409).send("Usuario já cadastrado")
        }
        await db.collection("cadastrados").insertOne({name, email, password: hash})
        res.sendStatus(201)
    }catch(err){
        res.sendStatus(500);
    }
})