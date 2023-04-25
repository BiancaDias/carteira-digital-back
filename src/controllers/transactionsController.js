import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function postTransaction (req, res){
    
    const dataAtual = dayjs().format('DD/MM');
    const {valor, descricao, tipo} = req.body;
    const userFind = res.locals.userFind
    try{
        await db.collection("transactions").insertOne({user: userFind.email, type: tipo, dia: dataAtual, valor, descricao})
        res.sendStatus(201)
    }catch(err){
        res.status(500).send(err);
    }
}

export async function getTransaction (req, res) {
    
    const userFind = res.locals.userFind
    try{
        const transactions = await db.collection("transactions").find({user: userFind.email}).toArray();
        res.send(transactions.reverse())
    }catch(err){
        res.status(500).send(err);
    }
}