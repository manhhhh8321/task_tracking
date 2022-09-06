const validator = require("validator");

import { Response, Request, NextFunction } from "express";
import { Admins } from "../interfaces/main";
import { userArray } from "./users";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const passwordStr = "123a";
var jwt = require("jsonwebtoken");
export const SECRET = "SECRET";
export const KEY = "KEY";

const hash = bcrypt.hashSync(passwordStr, saltRounds);

export const addminAccount: Admins[] = [
  { userID: 1, username: "admin", password: hash, role: "admin" },
];

export const userLogin = (req: Request, res: Response, next: NextFunction) => {
  const { uname, upass } = req.body;

  if (validator.isNumeric(uname) || validator.isNumeric(upass)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Request username or password invalid",
    });
  }

  const userIndex = userArray.findIndex((item) => item.username == uname);
  const adminIndex = addminAccount.findIndex((item) => item.username == uname);

  if (adminIndex >= 0) {
    const isBycrypted = bcrypt.compareSync(upass, hash);

    const user = addminAccount.find(
      (item) => item.username == uname && isBycrypted
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
      return res.status(403).json({
        status_code: 0,
        error_msg: "Username or password incorrect",
      });
    }
  } else {
    if (userIndex >= 0) {
      if (
        uname == userArray[userIndex].username &&
        bcrypt.compareSync(upass, userArray[userIndex].password) &&
        userArray[userIndex].active != false
      ) {
        const accessToken = jwt.sign(
          { username: userArray[userIndex].username },
          SECRET
        );
        return res.send(accessToken);
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
  }
};
