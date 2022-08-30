import { getIndex } from "../controllers/index";
import express from "express";
const router = express.Router();

router.get("/", getIndex);

module.exports = router;
