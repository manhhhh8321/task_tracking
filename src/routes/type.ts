import {
  createType,
  editType,
  setVisibleType,
  viewAllType,
} from "../controllers/type";
import express from "express";
const typeRouter = express.Router();

typeRouter.post("/", createType);
typeRouter.put("/:id", editType);
typeRouter.get("/", viewAllType);
typeRouter.patch("/:id", setVisibleType);

export { typeRouter };
