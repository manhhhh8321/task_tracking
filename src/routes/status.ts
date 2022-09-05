import {
  createStatus,
  editStatus,
  setVisibleStatus,
  viewAllStatus,
} from "../controllers/status";
import express from "express";
const statusRouter = express.Router();

statusRouter.post("/status", createStatus);
statusRouter.get("/status", viewAllStatus);
statusRouter.put("/status/:id", editStatus);
statusRouter.patch("/status/:id", setVisibleStatus);

export { statusRouter };
