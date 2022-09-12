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
const userPrivateTaskRouter = express.Router();

userPrivateTaskRouter.get("/:id/task", validateParamId, allUserTask);
userPrivateTaskRouter.post(
  "/:username/:id/task",
  validateParamId,
  validateTask,
  userCreatePrivateTask
);
userPrivateTaskRouter.delete("/:username/:id", userDeletePrivateTask);
userPrivateTaskRouter.put(
  "/:username/:id",
  validateUsernameAndParamsId,
  validateTask,
  userEditPrivateTask
);

export { userPrivateTaskRouter };
