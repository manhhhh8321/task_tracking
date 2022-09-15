import {
  createInviteID,
  createUser,
  deleteUser,
  editUser,
  viewAllUser,
  viewUserDetail,
} from "../controllers/users";
import express from "express";
import {
  validateCreateUser,
  validateEditUser,
  validateParamId,
} from "../middlewares/validations";
import { adminAuth } from "../middlewares/auth";
const userRouter = express.Router();

userRouter.get("/create-inviteid",adminAuth, createInviteID);
userRouter.post("/registers", validateCreateUser, createUser);
userRouter.get("/", adminAuth, viewAllUser);
userRouter.get("/:id", validateParamId,adminAuth,  viewUserDetail);
userRouter.put("/:id", validateParamId, validateEditUser,adminAuth,  editUser);
userRouter.delete("/:id", validateParamId,adminAuth,  deleteUser);

export { userRouter };
