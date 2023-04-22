import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/database.connection.js";
import { cadastroSchema, loginSchema } from "../schemas/user.schemas.js";



export async function postCadastro (req, res) {
    const { name, email, password } = req.body;
    const validation = cadastroSchema.validate(req.body, { abortEarly: false })
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
}

export async function postLogin (req, res) {
    const {email, password} = req.body;
    const validation = loginSchema.validate({email}, { abortEarly: false })
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

}

export async function postLogout (req, res) {
    const { token } = req.body;
    console.log(token)
    try{
        const del = await db.collection("logados").deleteOne({token});
        if(del.deletedCount===0) return res.sendStatus(400)
        res.sendStatus(200);
    }catch(err){
        res.status(500).send(err);
    }
}