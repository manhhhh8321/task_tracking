import {
  createInviteID,
  createUser,
  deleteUser,
  editUser,
  viewAllUser,
  viewUserDetail,
} from "../controllers/users";
import express from "express";
import { validateCreateUser, validateEditUser, validateParamId } from "../middlewares/validations";
const userRouter = express.Router();

userRouter.get("/create-inviteid", createInviteID);
userRouter.post("/register", validateCreateUser, createUser);
userRouter.get("/", viewAllUser);
userRouter.get("/:id",validateParamId, viewUserDetail);
userRouter.put("/:id",validateParamId,validateEditUser, editUser);
userRouter.delete("/:id",validateParamId, deleteUser);



export { userRouter };
