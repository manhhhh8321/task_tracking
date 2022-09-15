import { Response, Request, NextFunction } from "express";
import { AppDataSource } from "../data-source";

import { Admin, User } from "../entity/main";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const passwordStr = "123a";
var jwt = require("jsonwebtoken");
export const SECRET = "SECRET";

const hash = bcrypt.hashSync(passwordStr, saltRounds);

const adminRepo = AppDataSource.getRepository(Admin);
const userRepo = AppDataSource.getRepository(User);

export const createAdmin = async (req: Request, res: Response) => {
  // Delete data from table admin
  await adminRepo.clear();

  const user = new Admin();
  user.username = "admin";
  user.password = hash;

  const rs = async () => {
    await AppDataSource.manager.save(user);
    console.log("User has been saved");
  };
  rs();
  res.send("Created");
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { uname, upass } = req.body;

  const user = await userRepo.findOne({ where: { username: uname } });
  const admin = await adminRepo.findOne({ where: { username: uname } });

  if (admin) {
    const isBycrypted = bcrypt.compareSync(upass, hash);

    if (isBycrypted) {
      const accessToken = jwt.sign(
        { username: admin!.username, id: admin.id },
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
    if (user) {
      if (
        uname === user.username &&
        bcrypt.compareSync(upass, user.password) &&
        user.active != false
      ) {
        const accessToken = jwt.sign(
          { username: user.username, id: user.id },
          SECRET,
          { expiresIn: "1h" }
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
