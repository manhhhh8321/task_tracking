import { isValidProject, isValidStatus } from "../validators/valid";

import { Request, Response, NextFunction } from "express";

export const validateCreateProject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, start_date, end_date } = req.body;

  if (isValidProject(name, start_date, end_date)) {
    return next();
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Project input invalid",
    });
  }
};

export const validateNameAndOrder= (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, order } = req.body;
  if (!isValidStatus(name, order)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Numeric format invalid",
    });
  } else return next();
};
