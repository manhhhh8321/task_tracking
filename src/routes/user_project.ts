import {
  allTaskOfUserProject,
  createTaskForUser,
  userDeleteTask,
  userDetailProject,
  userEditTask,
  userJoinedProject,
} from "../controllers/user_project";
import express from "express";
const userProjectRouter = express.Router();

userProjectRouter.get("/projects/:userid", userJoinedProject);
userProjectRouter.get("/projects/:username/:projectid", userDetailProject);
userProjectRouter.get(
  "/projects/:username/:projectid/task",
  allTaskOfUserProject
);
userProjectRouter.post(
  "/projects/:username/:projectid/task",
  createTaskForUser
);
userProjectRouter.put("/projects/:username/:projectid/:taskid", userEditTask);
userProjectRouter.delete("/projects/:username/task", userDeleteTask);


export { userProjectRouter };
