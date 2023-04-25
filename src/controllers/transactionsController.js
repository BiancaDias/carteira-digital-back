import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function postTransaction (req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) return res.sendStatus(401);

    const dataAtual = dayjs().format('DD/MM');
    
    const {valor, descricao, tipo} = req.body;
    try{
        const user = await db.collection("logados").findOne({token});
        if(!user) return res.sendStatus(404)
        
        await db.collection("transactions").insertOne({user: user.email, type: tipo, dia: dataAtual, valor, descricao})
        
        res.sendStatus(201)
    }catch(err){
        res.status(500).send(err);
    }
}

export async function getTransaction (req, res) {
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
}