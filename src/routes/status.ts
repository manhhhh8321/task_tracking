import {
  createStatus,
  editStatus,
  setVisibleStatus,
  viewAllStatus,
} from "../controllers/status";
import express from "express";
import {
  validateParamId,
  validateNameAndOrder,
} from "../middlewares/validations";
const statusRouter = express.Router();

statusRouter.post("/", validateNameAndOrder, createStatus);
statusRouter.get("/", viewAllStatus);
statusRouter.put("/:id", validateParamId, validateNameAndOrder, editStatus);
statusRouter.patch("/:id", validateParamId, setVisibleStatus);

export { statusRouter };
