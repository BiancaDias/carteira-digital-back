import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import joi from 'joi';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

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

app.post("/cadastro", async (req, res) => {
    const usuarioSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required().min(3)
    })
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

app.post("/", async (req, res) => {
    const usuarioSchema = joi.object({
        email: joi.string().email().required(),
    })

    const {email, password} = req.body;
    const validation = usuarioSchema.validate({email}, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    try{
        const verificaSePossuiCadastro = await db.collection("cadastrados").findOne({email})
        if(!verificaSePossuiCadastro){
            return res.status(404).send("e-mail não encontrado")
        }
        const verificaSenha = bcrypt.compareSync(password, verificaSePossuiCadastro.password);
        if(!verificaSenha) return res.status(401).send("senha incorreta")
        const token = uuid();
        await db.collection("logados").insertOne({token, name:verificaSePossuiCadastro.name, email: verificaSePossuiCadastro.email})
        res.status(200).send({token, name:verificaSePossuiCadastro.name})
    }catch(err){
        res.status(500).send(err)
    }

})

app.post("/logout", async (req, res) => {
    const { token } = req.body;
    console.log(token)
    try{
        const del = await db.collection("logados").deleteOne({token});
        if(del.deletedCount===0) return res.sendStatus(400)
        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err);
    }
})

app.post("/transaction", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    const transactionSchema = joi.object({
        valor: joi.number().positive().precision(2).required(),
        descricao: joi.string().required(),
        tipo: joi.string().valid("saida","entrada").required()
    })

    const dataAtual = dayjs().format('DD/MM');
    const validation = transactionSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors)
    }
    const {valor, descricao, tipo} = req.body;
    try{
        const user = await db.collection("logados").findOne({token});
        if(!user) return res.sendStatus(404)
        
        await db.collection("transactions").insertOne({user: user.email, type: tipo, dia: dataAtual, valor, descricao})
        
        res.sendStatus(201)
    }catch(err){
        res.status(500).send(err);
    }
})

app.get("/transaction", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    try{
        const userFind = await db.collection("logados").findOne({token});
        if(!userFind) return res.sendStatus(404)
        const transactions = await db.collection("transactions").find({user: userFind.email}).toArray();
        res.send(transactions.reverse())
    }catch(err){
        res.status(500).send(err);
    }
})