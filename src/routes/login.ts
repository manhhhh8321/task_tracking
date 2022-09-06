import { userLogin } from "../controllers/admin_login";
import express from "express";
import { validateLogin } from "../middlewares/validations";
const loginRouter = express.Router();

loginRouter.post("/login", validateLogin, userLogin);

export { loginRouter };
