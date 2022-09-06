import {
  createTask,
  deleteTask,
  editTask,
  viewAllTasks,
} from "../controllers/task";
import express from "express";
const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.put("/:id", editTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.get("/", viewAllTasks);

export { taskRouter };
