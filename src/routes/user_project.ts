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
  validateParamsUserNameAndBodyTaskname,
  validateProjectIdAndTaskId,
  validateUsernameAndParamsId,
} from "../middlewares/validations";
const userProjectRouter = express.Router();

userProjectRouter.get("/:id", validateParamId, userJoinedProject);
userProjectRouter.get("/:username/:id", validateUsernameAndParamsId, userDetailProject);
userProjectRouter.get(
  "/:username/:id/task",
  validateUsernameAndParamsId,
  allTaskOfUserProject
);
userProjectRouter.post(
  "/:username/:id/task",
  validateUsernameAndParamsId,
  createTaskForUser
);
userProjectRouter.put(
  "/:username/:projectid/:task_id",
  validateProjectIdAndTaskId,
  userEditTask
);
userProjectRouter.delete("/:username/task", validateParamsUserNameAndBodyTaskname, userDeleteTask);

export { userProjectRouter };
