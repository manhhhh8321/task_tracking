import { Response, Request, NextFunction } from "express";
import { Admins } from "../interfaces/main";
import { userArray } from "./users";
import { AppDataSource } from "../data-source";
import { Admin } from "../entity/main";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const passwordStr = "123a";
var jwt = require("jsonwebtoken");
export const SECRET = "SECRET";

const hash = bcrypt.hashSync(passwordStr, saltRounds);

export const adminAccount: Admins[] = [];

export const createAdmin = async (req: Request, res: Response) => {
  // Delete data from table admin
  const adminRepository = AppDataSource.getRepository(Admin);
  await adminRepository.clear();

  const user = new Admin();
  user.username = "admin";
  user.password = hash;
  user.role = "admin";

  const rs = async () => {
    await AppDataSource.manager.save(user);
    console.log("User has been saved");
  };
  rs();
  res.send("Created")
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { uname, upass } = req.body;

  const adminRepo = AppDataSource.getRepository(Admin);
  const allAdmins = await adminRepo.find();

  const userIndex = userArray.findIndex((item) => item.username === uname);
  const adminIndex = allAdmins.findIndex((item) => item.username === uname);

  if (adminIndex >= 0) {
    const isBycrypted = bcrypt.compareSync(upass, hash);

    const user = allAdmins.find(
      (item) => item.username === uname && isBycrypted
    );

    if (user) {
      const accessToken = jwt.sign(
        { username: user.username, role: user.role },
        SECRET
      );

      return res.json({
        accessToken,
      });
    } else {
      return res.status(412).json({
        error_msg: "Username or password incorrect",
      });
    }
  } else {
    if (userIndex >= 0) {
      if (
        uname === userArray[userIndex].username &&
        bcrypt.compareSync(upass, userArray[userIndex].password) &&
        userArray[userIndex].active != false
      ) {
        const accessToken = jwt.sign(
          { username: userArray[userIndex].username },
          SECRET
        );
        return res.send(accessToken);
      } else {
        return res.status(412).json({
          error_msg: "Username or password incorrect",
        });
      }
    } else {
      return res.status(404).json({
        error_msg: "User not found",
      });
    }
  }
};
