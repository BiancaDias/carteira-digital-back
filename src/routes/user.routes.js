import { Router } from "express";
import { postCadastro, postLogin, postLogout } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/cadastro", postCadastro);

userRouter.post("/", postLogin)

userRouter.post("/logout", postLogout)

export default userRouter