const decode = require("jwt-decode");

import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { SECRET } from "../controllers/admin_login";
import { userArray } from "../controllers/users";
import { AppDataSource } from "../data-source";
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

  const allUsers = await userRepo.find();
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decoded = decode(token);

    const userIndex = allUsers.findIndex(
      (item) => item.id === parseInt(req.params.id)
    );

    if (userIndex < 0) {
      return res.sendStatus(404);
    } 

    if (allUsers[userIndex].username === decoded.username && allUsers[userIndex].id === decoded.id) {
      jwt.verify(token, SECRET, (err: Error) => {
        if (err) {
          return res.sendStatus(403);
        }
      });
      next();
    } else {
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};
