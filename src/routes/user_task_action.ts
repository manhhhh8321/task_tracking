import {
  allUserTask,
  userCreatePrivateTask,
  userDeletePrivateTask,
  userEditPrivateTask,
} from "../controllers/user_task_actions";
import express from "express";
import {
  validateParamId,
  validateTask,
  validateUsernameAndParamsId,
} from "../middlewares/validations";
import { userAuth } from "../middlewares/auth";
const userPrivateTaskRouter = express.Router();

userPrivateTaskRouter.get("/:username/task", userAuth, allUserTask);
userPrivateTaskRouter.post(
  "/:username/:id/task",
  validateParamId,
  validateTask,
  userAuth,
  userCreatePrivateTask
);
userPrivateTaskRouter.delete("/:username/:id", userAuth, userDeletePrivateTask);
userPrivateTaskRouter.put(
  "/:username/:id",
  validateUsernameAndParamsId,
  validateTask,
  userAuth,
  userEditPrivateTask
);

export { userPrivateTaskRouter };
