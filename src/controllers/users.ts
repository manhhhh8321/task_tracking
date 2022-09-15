const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const saltRounds = 10;

import { Request, Response } from "express";

import { Project, User } from "../entity/main";
import { AppDataSource } from "../data-source";
import { Invite } from "../entity/main";

const userRepo = AppDataSource.getRepository(User);
const inviteRepo = AppDataSource.getRepository(Invite);
const projectRepo = AppDataSource.getRepository(Project);

export const createInviteID = async (req: Request, res: Response) => {
  const newId = uniqid();
  const inviteRepo = AppDataSource.getRepository(Invite);

  const invite = await inviteRepo.findOne({ where: { id: newId } });

  if (invite) {
    return res.status(409).json({
      error_msg: "Invite ID already exists",
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

  const user = await userRepo.findOne({ where: { username: req_username } });
  const invite = await inviteRepo.findOne({ where: { id: req_inviteID } });
  const em = await userRepo.findOne({ where: { email: email } });

  const allProject = await projectRepo.find();

  let defaultProject = allProject[0].projectName;

  if (allProject.length < 0) {
    defaultProject = "";
  }

  if (user) {
    return res.status(412).json({
      error_msg: "Username already exists",
    });
  }

  if (em) {
    return res.status(412).json({
      error_msg: "Email already exists",
    });
  }

  if (!invite) {
    return res.status(412).json({
      error_msg: "Invite ID is not valid",
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
    newUser.defaultProject = defaultProject;
    newUser.allProjects = [];
    newUser.task = [];
    return newUser;
  };

  const newUser = createNewUser();
  await userRepo.save(newUser).catch((err) => {
    return res.status(412).json({
      error_msg: "Create user failed",
    });
  });

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

  const user = await userRepo.findOne({ where: { id: user_id } });

  if (!user) {
    return res.status(404).json({
      error_msg: "User not found",
    });
  }

  res.send(
    `All user projects : ${user.allProjects}\nAll user tasks : ${user.task}`
  );
};

export const deleteUser = async (req: Request, res: Response) => {
  const user_id = req.params.id;

  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { id: parseInt(user_id) } });

  if (!user) {
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

  const user = await userRepo.findOne({ where: { id: user_id } });

  if (!user) {
    return res.status(404).json({
      error_msg: "User not found",
    });
  }
  // Create new query builder to update user by id
  const query = userRepo.createQueryBuilder();
  await query
    .update(User)
    .set({
      name: name,
      birthday: birthday,
      email: email,
      active: active,
    })
    .where("id = :id", { id: user_id })
    .execute()
    .catch((err) => {
      return res.status(400).json({
        error_msg: "Cannot update user",
      });
    });

  res.send(`Update user ${user_id} successfully`);
};
