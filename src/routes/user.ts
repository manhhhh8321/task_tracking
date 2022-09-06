import {
  createInviteID,
  createUser,
  deleteUser,
  editUser,
  viewAllUser,
  viewUserDetail,
} from "../controllers/users";
import express from "express";
const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.get("/", viewAllUser);
userRouter.get("/:userid", viewUserDetail);
userRouter.put("/:userid", editUser);
userRouter.delete("/:userid", deleteUser);
userRouter.get("/create-inviteid", createInviteID);


export { userRouter };
