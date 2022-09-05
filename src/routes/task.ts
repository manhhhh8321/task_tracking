import {
  createTask,
  deleteTask,
  editTask,
  viewAllTasks,
} from "../controllers/task";
import express from "express";
const taskRouter = express.Router();

taskRouter.post("/task", createTask);
taskRouter.put("/task/:id", editTask);
taskRouter.delete("/task/:id", deleteTask);
taskRouter.get("/task", viewAllTasks);

export { taskRouter };
