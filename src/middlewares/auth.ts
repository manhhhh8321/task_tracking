const decode = require("jwt-decode");
const jwt = require("jsonwebtoken");

import { AppDataSource } from "../data-source";
import { Request, Response, NextFunction } from "express";

import { SECRET } from "../controllers/admin_login";
import { User } from "../entity/main";

const userRepo = AppDataSource.getRepository(User);

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decoded = decode(token);

    if (decoded.username === "admin") {
      jwt.verify(token, SECRET, (err: Error) => {
        if (err) {
          return res.sendStatus(403);
        }
      });
      return next();
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(401);
  }
};

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decoded = decode(token);

    const user = await userRepo.findOne({
      where: { username: req.params.username },
    });

    if (user?.username === decoded.username) {
      jwt.verify(token, SECRET, (err: Error) => {
        if (err) {
          return res.sendStatus(403);
        }
      });
      return next();
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(401);
  }
};
