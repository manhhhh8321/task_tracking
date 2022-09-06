import {
  isValidLogin,
  isValidProject,
  isValidStatus,
  isValidTask,
  isValidType,
  isValidUser,
} from "../validators/valid";

const validator = require("validator");

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

export const validateNameAndOrder = (
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

export const validateNameAndColor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, req_color } = req.body;

  if (isValidType(name, req_color)) return next();
  else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Name or request color invalid",
    });
  }
};

export const validateParamId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_id = req.params.id;

  if (!validator.isInt(req_id, { min: 0, max: undefined })) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Numeric type invalid",
    });
  }
  return next();
};

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    assignee,
    req_start_date,
    req_end_date,
    req_project_id,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;
  //Validate task input
  if (
    isValidTask(
      name,
      assignee,
      req_start_date,
      req_end_date,
      req_project_id,
      req_prior_id,
      req_status_id,
      req_type_id
    )
  ) {
    return next();
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Task input invalid",
    });
  }
};

//Validate user login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { uname, upass } = req.body;
  if (isValidLogin(uname, upass)) return next();
  else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Email or password invalid",
    });
  }
};

export const validateProjectIdAndTaskId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_project_id = req.params.id;
  const req_task_id = req.params.task_id;
  if (
    !validator.isInt(req_project_id, { min: 0, max: undefined }) ||
    !validator.isInt(req_task_id, { min: 0, max: undefined })
  ) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Numeric type invalid",
    });
  }
  return next();
};

export const validateUsernameAndParamsId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_username = req.params.username;
  const req_id = req.params.id;
  if (
    !validator.isInt(req_id, { min: 0, max: undefined }) ||
    !validator.isAlphanumeric(req_username)
  ) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Username or params id invalid",
    });
  }
  return next();
};

export const validateParamsUserNameAndBodyTaskname = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_username = req.params.username;
  const req_task_name = req.body.taskname;
  if (
    !validator.isAlphanumeric(req_username) ||
    !validator.isAlphanumeric(req_task_name)
  ) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Username or task name invalid",
    });
  }
  return next();
};

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { req_username, req_password, name, birthday, email } = req.body;
  if (!isValidUser(req_username, req_password, name, birthday, email)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Username or password invalid",
    });
  }
  return next();
};

export const validateEditUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, birthday, email, active } = req.body;
  if (
    !validator.isAlphanumeric(name) ||
    !validator.isEmail(email) ||
    !validator.isDate(birthday) ||
    !validator.isBoolean(active)
  ) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Name or email or birthday or active invalid",
    });
  }
  return next();
};
