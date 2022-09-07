const validator = require("validator");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const saltRounds = 10;

import { Users } from "../interfaces/main";
import { Request, Response } from "express";
import { projectArray } from "./project";


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

  const hash = bcrypt.hashSync(req_password, saltRounds);

  const index = userArray.findIndex((item) => item.username === req_username);

  if (index >= 0) {
    return res.status(409).json({
      error_msg: "User already exists",
    });
  }
  const inviteIdIndex = inviteIdList.indexOf(req_inviteID);

  if (inviteIdIndex < 0) {
    return res.status(400).json({
      error_msg: "InviteID invalid",
    });
  }

  const users: Users = {
    id: userArray.length + 1,
    username: req_username,
    password: hash,
    name: name,
    birthday: birthday,
    email: email,
    inviteID: req_inviteID,
    active: true,
    defaultProject: projectArray[0],
    allProjects: [],
    project: projectArray[0],
    task: [],
  };

  if (userArray.push(users)) {
    inviteIdList.splice(inviteIdIndex, 1);
  }
  res.send(userArray);
};

export const viewAllUser = (req: Request, res: Response) => {
  res.send(userArray);
};

export const viewUserDetail = (req: Request, res: Response) => {
  const user_id = parseInt(req.params.userid);

  if (userArray.length < 0) {
    return res.status(204).json({
      error_msg: "User not exists",
    });
  }

  const userIndex = userArray.findIndex((item) => item.id === user_id);

  res.send(`${userArray[userIndex].allProjects}\n${userArray[userIndex].task}`);
};

export const deleteUser = (req: Request, res: Response) => {
  const user_id = req.params.userid;

  if (!validator.isInt(user_id, {min: 0, max: undefined})) {
    return res.status(404).json({
      error_msg: "Request id invalid",
    });
  }

  if (userArray.length < 0) {
    return res.status(204).json({
      error_msg: "Cannot find any user",
    });
  }
  const userIndex = userArray.findIndex(
    (item) => item.id === parseInt(user_id)
  );

  if (userIndex >= 0) {
    userArray.splice(userIndex, 1);
  } else {
    return res.status(400).json({
      status_code: 0,
      error_msg: "Cannot delete user",
    });
  }
  res.send(`Deleted`);
};

export const editUser = (req: Request, res: Response) => {
  const user_id = parseInt(req.params.userid);
  const { name, birthday, email, active } = req.body;

  if (
    !validator.isInt(user_id, {min: 0, max: undefined}) ||
    validator.isNumeric(name) ||
    !validator.isEmail(email) ||
    !validator.isBoolean(active)
  ) {
    return res.status(400).json({
      error_msg: "User information input incorrect",
    });
  }

  if (userArray.length < 0) {
    return res.status(404).json({
      error_msg: "Cannot find any user",
    });
  }

  const userIndex = userArray.findIndex((item) => item.id === user_id);

  userArray[userIndex].name = name;
  userArray[userIndex].birthday = birthday;
  userArray[userIndex].email = email;
  userArray[userIndex].active = active;
  res.send(`Updated user ${name}`);
};

