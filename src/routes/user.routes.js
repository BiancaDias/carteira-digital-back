import { Router } from "express";
import { validate } from "uuid";
import { postCadastro, postLogin, postLogout } from "../controllers/userController.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { cadastroSchema } from "../schemas/user.schemas.js";

const userRouter = Router();

userRouter.post("/cadastro",validateSchema(cadastroSchema), postCadastro);

userRouter.post("/", postLogin)

userRouter.post("/logout", postLogout)

export default userRouter