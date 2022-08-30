import { getIndex } from "../controllers/index";
import { adminLogin } from "../controllers/admin_login";
import express from "express";
const router = express.Router();

router.post("/login", adminLogin);

export { router };
