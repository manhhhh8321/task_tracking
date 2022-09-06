import {
  createPrior,
  editPrior,
  setVisiblePrior,
  viewAllPrior,
} from "../controllers/priority";
import express from "express";
import { validateNameAndOrder } from "../middlewares/validations";
const priorityRouter = express.Router();

priorityRouter.post("/", validateNameAndOrder, createPrior);
priorityRouter.get("/", viewAllPrior);
priorityRouter.put("/:id", validateNameAndOrder, editPrior);
priorityRouter.patch("/:id", setVisiblePrior);

export { priorityRouter };
