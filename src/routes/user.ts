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
userRouter.get("/user", viewAllUser);
userRouter.get("/user/:userid", viewUserDetail);
userRouter.put("/user/:userid", editUser);
userRouter.delete("/user/:userid", deleteUser);
userRouter.get("/create-inviteid", createInviteID);


export { userRouter };
