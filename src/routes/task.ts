import {
  createTask,
  deleteTask,
  editTask,
  viewAllTasks,
} from "../controllers/task";
import express from "express";
import { validateParamId, validateTask } from "../middlewares/validations";
const taskRouter = express.Router();

taskRouter.post("/", validateTask, createTask);
taskRouter.put("/:id", validateParamId, validateTask, editTask);
taskRouter.delete("/:id", validateParamId, deleteTask);
taskRouter.get("/", viewAllTasks);

export { taskRouter };
