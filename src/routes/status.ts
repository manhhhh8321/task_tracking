import {
  createStatus,
  editStatus,
  setVisibleStatus,
  viewAllStatus,
} from "../controllers/status";
import express from "express";
import { validateNameAndOrder } from "../middlewares/validations";
const statusRouter = express.Router();

statusRouter.post("/", validateNameAndOrder, createStatus);
statusRouter.get("/", viewAllStatus);
statusRouter.put("/:id", validateNameAndOrder, editStatus);
statusRouter.patch("/:id", setVisibleStatus);

export { statusRouter };
