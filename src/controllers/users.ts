const validator = require("validator");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const saltRounds = 10;

import { Users } from "../interfaces/main";
import { Request, Response } from "express";
import { projectArray } from "./project";
import { Project, User } from "../entity/main";
import { AppDataSource } from "../data-source";
import { Invite } from "../entity/main";

export const userArray: Users[] = [];

export const inviteIdList: string[] = [];

const userRepo = AppDataSource.getRepository(User);
const inviteRepo = AppDataSource.getRepository(Invite);
const projectRepo = AppDataSource.getRepository(Project);

export const createInviteID = async (req: Request, res: Response) => {
  const newId = uniqid();
  const inviteRepo = AppDataSource.getRepository(Invite);
  const allInvites = await inviteRepo.find();
  const inviteIndex = allInvites.findIndex((item) => item.id === newId);

  if (inviteIndex >= 0) {
    return res.status(404).json({
      error_msg: "Invite ID is existed",
    });
  }

  const createNewInvite = () => {
    const newInvite = new Invite();
    newInvite.id = newId;
    return newInvite;
  };

  const newInvite = createNewInvite();
  const rs = await inviteRepo.save(newInvite);

  if (!rs) {
    return res.status(404).json({
      error_msg: "Create invite ID failed",
    });
  }
  res.send(newId);
};

export const createUser = async (req: Request, res: Response) => {
  const { req_username, req_password, req_inviteID, name, birthday, email } =
    req.body;

  const hash = bcrypt.hashSync(req_password, saltRounds);

  const allUsers = await userRepo.find();
  const allInvites = await inviteRepo.find();
  const allProjects = await projectRepo.find();

  const index = allUsers.findIndex((item) => item.username === req_username);

  if (index >= 0) {
    return res.status(409).json({
      error_msg: "User already exists",
    });
  }

  const inviteIndex = allInvites.findIndex((item) => item.id === req_inviteID);

  if (inviteIndex < 0) {
    return res.status(400).json({
      error_msg: "InviteID invalid",
    });
  }

  // Create transaction to create new user and delete inviteID from invite table
  const createNewUser = () => {
    const newUser = new User();
    newUser.username = req_username;
    newUser.password = hash;
    newUser.name = name;
    newUser.birthday = birthday;
    newUser.email = email;
    newUser.inviteID = req_inviteID;
    newUser.active = true;
    newUser.defaultProject = allProjects[0].projectName || "default";
    newUser.allProjects = [];
    newUser.task = [];
    return newUser;
  };

  const newUser = createNewUser();
  const rs = await userRepo.save(newUser);

  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot create user",
    });
  }

  const deleteInvite = await inviteRepo.delete(req_inviteID);

  if (!deleteInvite) {
    return res.status(500).json({
      error_msg: "Cannot delete invite ID",
    });
  }

  res.send("Create user successfully");
};

export const viewAllUser = async (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const allUsers = await userRepo.find();

  if (!allUsers) {
    return res.status(404).json({
      error_msg: "View all user failed",
    });
  }
  res.send(allUsers);
};

export const viewUserDetail = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.userid);

  const userRepo = AppDataSource.getRepository(User);
  const allUsers = await userRepo.find();

  if (allUsers.length < 0) {
    return res.status(204).json({
      error_msg: "User not exists",
    });
  }

  const userIndex = allUsers.findIndex((item) => item.id === user_id);

  res.send(
    `All user projects : ${allUsers[userIndex].allProjects}\nAll user tasks : ${allUsers[userIndex].task}`
  );
};

export const deleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.id;

  const userRepo = AppDataSource.getRepository(User);
  const allUsers = await userRepo.find();

  if (allUsers.length < 0) {
    return res.status(204).json({
      error_msg: "Cannot find any user",
    });
  }

  const userIndex = allUsers.findIndex((item) => item.id === parseInt(user_id));

  if (userIndex < 0) {
    return res.status(400).json({
      status_code: 0,
      error_msg: "Cannot delete user",
    });
  }
  // Create new query builder to delete user by id
  const query = userRepo.createQueryBuilder();
  const rs = await query
    .delete()
    .from(User)
    .where("id = :id", { id: user_id })
    .execute();

  if (!rs) {
    return res.status(400).json({
      error_msg: "Cannot delete user",
    });
  }
  res.send(`Delete user ${user_id} successfully`);
};

export const editUser = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id);
  const { name, birthday, email, active } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const allUsers = await userRepo.find();

  if (allUsers.length < 0) {
    return res.status(404).json({
      error_msg: "Cannot find any user",
    });
  }

  const userIndex = allUsers.findIndex((item) => item.id === user_id);
  if (userIndex < 0) {
    return res.status(400).json({
      error_msg: "Cannot find user",
    });
  }

  // Create new query builder to update user by id
  const query = userRepo.createQueryBuilder();
  const rs = await query
    .update(User)
    .set({
      name: name,
      birthday: birthday,
      email: email,
      active: active,
    })
    .where("id = :id", { id: user_id })
    .execute();

  if (!rs) {
    return res.status(400).json({
      error_msg: "Cannot update user",
    });
  }
  res.send(`Update user ${user_id} successfully`);
};
