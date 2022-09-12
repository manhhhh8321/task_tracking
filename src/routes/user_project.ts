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
import { isValidUserCreateTask } from "../validators/valid";
const userProjectRouter = express.Router();

userProjectRouter.get("/:id", validateParamId, userAuth, userJoinedProject);
userProjectRouter.get(
  "/:username/:id",
  validateUsernameAndParamsId,
  userDetailProject
);
userProjectRouter.get(
  "/:username/:id/task",
  validateUsernameAndParamsId,
  allTaskOfUserProject
);
userProjectRouter.post(
  "/:username/:id/task",
  validateUsernameAndParamsId,
  validateUserCreateTask,
  createTaskForUser
);
userProjectRouter.put(
  "/:username/:project_id/:task_id",
  validateProjectIdAndTaskId,
  validateUserCreateTask,
  userEditTask
);
userProjectRouter.delete(
  "/:username/:task_id",
  userDeleteTask
);

export { userProjectRouter };
