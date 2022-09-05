import {
  createType,
  editType,
  setVisibleType,
  viewAllType,
} from "../controllers/type";
import express from "express";
const typeRouter = express.Router();

typeRouter.post("/type", createType);
typeRouter.put("/type/:id", editType);
typeRouter.get("/type", viewAllType);
typeRouter.patch("/type/:id", setVisibleType);

export { typeRouter };
