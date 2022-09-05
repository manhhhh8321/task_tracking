import { userLogin } from "../controllers/admin_login";
import express from "express";
const loginRouter = express.Router();

loginRouter.post("/login", userLogin);

export { loginRouter };
