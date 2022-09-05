import {
  createPrior,
  editPrior,
  setVisiblePrior,
  viewAllPrior,
} from "../controllers/priority";
import express from "express";
const priorityRouter = express.Router();

priorityRouter.post("/priority", createPrior);
priorityRouter.get("/priority", viewAllPrior);
priorityRouter.put("/priority/:id", editPrior);
priorityRouter.patch("/priority/:id", setVisiblePrior);

export {priorityRouter};