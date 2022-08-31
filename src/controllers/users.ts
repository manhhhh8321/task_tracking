const validator = require("validator");
const uniqid = require("uniqid");

import { Users } from "../interfaces/main";
import { Request, Response } from "express";
import { projectArray } from "./project";
import { taskArray } from "./task";

export const userArray: Users[] = [];

export const inviteIdList: string[] = [];

export const createInviteID = (req: Request, res: Response) => {
  const newId = uniqid();
  inviteIdList.push(newId);
  res.send(newId);
};

export const createUser = (req: Request, res: Response) => {
  const { req_username, req_password, req_inviteID, name, birthday, email } =
    req.body;

  const validEmail = validator.isEmail(email);
  const validBirthday = validator.isDate(birthday, "MM-DD-YYYY");

  if (!validEmail || !validBirthday) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Date or email invalid",
    });
  }

  const users: Users = {
    userID: userArray.length + 1,
    username: req_username,
    password: req_password,
    name: name,
    birthday: birthday,
    email: email,
    inviteID: req_inviteID,
    active: true,
    defaultProject: projectArray[0].projectName,
    allProjects: [`${projectArray[0]}`],
    project: projectArray[0],
    task: [],
  };
  const index = userArray.findIndex((item) => item.username == req_username);

  if (index >= 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User already exists",
    });
  }
  const inviteIdIndex = inviteIdList.indexOf(req_inviteID);

  if (inviteIdIndex < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "InviteID invalid",
    });
  }

  if (userArray.push(users)) {
    inviteIdList.splice(inviteIdIndex, 1);
  }
  res.send(userArray);
};

export const viewAllUser = (req: Request, res: Response) => {
  res.send(userArray);
};

export const viewUserDetail = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);

  if (userArray.length < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not exists",
    });
  }

  const userIndex = userArray.findIndex((item) => item.userID == userid);

  res.send(`${userArray[userIndex].allProjects}\n${userArray[userIndex].task}`);
};

export const deleteUser = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);

  if (userArray.length < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find any user",
    });
  }
  const userIndex = userArray.findIndex((item) => item.userID == userid);

  if (userIndex >= 0) {
    userArray.splice(userIndex, 1);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot delete user",
    });
  }
  res.send(`Deleted ${userArray[userIndex].username}`);
};

export const editUser = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);
  const { name, birthday, email, active } = req.body;

  if (userArray.length < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find any user",
    });
  }

  const validEmail = validator.isEmail(email);
  const validBirthday = validator.isDate(birthday, "MM-DD-YYYY");

  if (!validEmail || !validBirthday) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Date or email invalid",
    });
  }

  const valid_active = validator.isBoolean(active);
  if (!valid_active) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Active state not correct",
    });
  }

  const userIndex = userArray.findIndex((item) => item.userID == userid);

  userArray[userIndex].name = name;
  userArray[userIndex].birthday = birthday;
  userArray[userIndex].email = email;
  userArray[userIndex].active = active;
};

export const userLogin = (req: Request, res: Response) => {
  const { uname, upass } = req.body;
  const userIndex = userArray.findIndex((item) => item.username == uname);

  if (userIndex > 0) {
    if (
      uname == userArray[userIndex] &&
      upass == userArray[userIndex].password &&
      userArray[userIndex].active != false
    ) {
      return res.send("Logged in");
    } else {
      return res.status(403).json({
        status_code: 0,
        error_msg: "Username or password incorrect",
      });
    }
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not found",
    });
  }
};
