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
const userProjectRouter = express.Router();

userProjectRouter.get("/:id", validateParamId, userJoinedProject);
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
  "/:username/:projectid/:taskid",
  validateProjectIdAndTaskId,
  validateTask,
  userEditTask
);
userProjectRouter.delete(
  "/:username/task",
  validateParamsUserNameAndBodyTaskName,
  userDeleteTask
);

export { userProjectRouter };
