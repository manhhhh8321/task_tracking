import {
  allTaskOfUserProject,
  createTaskForUser,
  userDeleteTask,
  userDetailProject,
  userEditTask,
  userJoinedProject,
} from "../controllers/user_project";
import express from "express";
import {
  validateParamId,
  validateParamsUserNameAndBodyTaskName,
  validateProjectIdAndTaskId,
  validateTask,
  validateUserCreateTask,
  validateUsernameAndParamsId,
} from "../middlewares/validations";
import { userAuth } from "../middlewares/auth";
const userProjectRouter = express.Router();

userProjectRouter.get("/:id", validateParamId, userAuth, userJoinedProject);
userProjectRouter.get(
  "/:username/:id",
  validateUsernameAndParamsId,
  userAuth,
  userDetailProject
);
userProjectRouter.get(
  "/:username/:id/task",
  validateUsernameAndParamsId,
  userAuth,
  allTaskOfUserProject
);
userProjectRouter.post(
  "/:username/:id/task",
  validateUsernameAndParamsId,
  validateUserCreateTask,
  userAuth,
  createTaskForUser
);
userProjectRouter.put(
  "/:username/:project_id/:task_id",
  validateProjectIdAndTaskId,
  validateUserCreateTask,
  userAuth,
  userEditTask
);
userProjectRouter.delete("/:username/:task_id", userAuth, userDeleteTask);

export { userProjectRouter };
