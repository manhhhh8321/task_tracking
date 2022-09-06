const decode = require("jwt-decode");

import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import { SECRET } from "../controllers/admin_login";

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const decoded = decode(token);

    if (decoded.username == "admin") {
      jwt.verify(token, SECRET, (err: Error) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      });
      next();
    }
  } else {
    res.sendStatus(401);
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

    if (decoded.username != "admin") {
      jwt.verify(token, SECRET, (err: Error) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      });
      next();
    }
  } else {
    res.sendStatus(401);
  }
};
