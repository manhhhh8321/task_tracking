import {
  allUserTask,
  userCreatePrivateTask,
  userDeletePrivateTask,
  userEditPrivateTask,
} from "../controllers/user_task_actions";
import express from "express";
import {
  validateParamId,
  validateUsernameAndParamsId,
} from "../middlewares/validations";
const userPrivateTaskRouter = express.Router();

userPrivateTaskRouter.get("/:id/task", validateParamId, allUserTask);
userPrivateTaskRouter.post("/:id/task", validateParamId, userCreatePrivateTask);
userPrivateTaskRouter.delete("/:username/task", userDeletePrivateTask);
userPrivateTaskRouter.put(
  "/:username/:id",
  validateUsernameAndParamsId,
  userEditPrivateTask
);

export { userPrivateTaskRouter };
