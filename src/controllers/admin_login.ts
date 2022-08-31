import { adminData } from "../data/auth";
import { Response, Request, NextFunction } from "express";
import { Admins } from "../interfaces/main";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const passwordStr = "123";
var jwt = require("jsonwebtoken");
export const SECRET = "SECRET";

const hash = bcrypt.hashSync(passwordStr, saltRounds);

export const addminAccount: Admins[] = [
  { userID: 1, username: "admin", password: hash, role: "admin" },
];


export const adminLogin = function (req: Request, res: Response) {
  const { name, pass } = req.body;
  const isBycrypted = bcrypt.compareSync(pass, hash);
  const user = addminAccount.find(
    (item) => item.username == name && isBycrypted
  );

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      SECRET
    );

    res.json({
      accessToken,
    });
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Username or password incorrect",
    });
  }
};

export const testToken = (req: Request, res: Response, next: NextFunction) => {
  res.send("Access complete")
};
