import {
  createType,
  editType,
  setVisibleType,
  viewAllType,
} from "../controllers/type";
import express from "express";
import { validateParamId, validateNameAndColor } from "../middlewares/validations";
const typeRouter = express.Router();

typeRouter.post("/", validateNameAndColor,createType);
typeRouter.put("/:id", validateParamId, validateNameAndColor, editType);
typeRouter.get("/", viewAllType);
typeRouter.patch("/:id", validateParamId, setVisibleType);

export { typeRouter };
