
import { Response, Request, NextFunction } from "express";
import { Admins } from "../interfaces/main";
import { userArray } from "./users";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const passwordStr = "123a";
var jwt = require("jsonwebtoken");
export const SECRET = "SECRET";

const hash = bcrypt.hashSync(passwordStr, saltRounds);

export const adminAccount: Admins[] = [
  { userID: 1, username: "admin", password: hash, role: "admin" },
];

export const userLogin = (req: Request, res: Response, next: NextFunction) => {
  const { uname, upass: upas } = req.body;

  const userIndex = userArray.findIndex((item) => item.username === uname);
  const adminIndex = adminAccount.findIndex((item) => item.username === uname);

  if (adminIndex >= 0) {
    const isBycrypted = bcrypt.compareSync(upas, hash);

    const user = adminAccount.find(
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
        bcrypt.compareSync(upas, userArray[userIndex].password) &&
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
