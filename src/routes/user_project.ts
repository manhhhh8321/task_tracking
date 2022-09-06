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

userProjectRouter.get("/:userid", userJoinedProject);
userProjectRouter.get("/:username/:projectid", userDetailProject);
userProjectRouter.get(
  "/:username/:projectid/task",
  allTaskOfUserProject
);
userProjectRouter.post(
  "/:username/:projectid/task",
  createTaskForUser
);
userProjectRouter.put("/:username/:projectid/:taskid", userEditTask);
userProjectRouter.delete("/:username/task", userDeleteTask);


export { userProjectRouter };
