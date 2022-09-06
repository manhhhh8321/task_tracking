import {
  createPrior,
  editPrior,
  setVisiblePrior,
  viewAllPrior,
} from "../controllers/priority";
import express from "express";
import {
  validateNameAndOrder,
  validateParamId,
} from "../middlewares/validations";
const priorityRouter = express.Router();

priorityRouter.post("/", validateNameAndOrder, createPrior);
priorityRouter.get("/", viewAllPrior);
priorityRouter.put("/:id", validateParamId, validateNameAndOrder, editPrior);
priorityRouter.patch("/:id", validateParamId, setVisiblePrior);

export { priorityRouter };
