import {
  allUserTask,
  userCreatePrivateTask,
  userDeletePrivateTask,
  userEditPrivateTask,
} from "../controllers/user_task_actions";
import express from "express";
const userPrivateTaskRouter = express.Router();

userPrivateTaskRouter.get("/:userid/task", allUserTask);
userPrivateTaskRouter.post("/:userid/task", userCreatePrivateTask);
userPrivateTaskRouter.delete("/:username/task", userDeletePrivateTask);
userPrivateTaskRouter.put("/:username/:taskid", userEditPrivateTask);

export { userPrivateTaskRouter };
