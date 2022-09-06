import {
  isValidEditUser,
  isValidLogin,
  isValidProject,
  isValidStatus,
  isValidTask,
  isValidType,
  isValidUser,
  isValidUserCreateTask,
} from "../validators/valid";

export const error = {
  string_input_err(str: any) {
    return `${str} must be a string`;
  },
  number_input_err(str: any) {
    return `${str} must be a number`;
  },
  boolean_input_err: { error_msg: "Must be a boolean" },
  email_input_err: "Email must be a valid email",
  date_input_err: { error_msg: "Date input invalid" },
  date_range_err: { error_msg: "Date range invalid" },
};

const validator = require("validator");

import { Request, Response, NextFunction } from "express";

export const validateCreateProject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, start_date, end_date } = req.body;

  const result = isValidProject(name, start_date, end_date);
  if (result) res.send(result);
  else next();
};

export const validateNameAndOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, order } = req.body;
  const result = isValidType(name, order);
  if (result) res.send(result);
  else next();
};

export const validateNameAndColor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, req_color } = req.body;

  const result = isValidStatus(name, req_color);
  if (result) res.send(result);
  else next();
};

export const validateParamId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_id = req.params.id;

  if (!validator.isInt(req_id, { min: 0, max: undefined })) {
    return res.status(400).json({
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

  const result = isValidTask(
    name,
    assignee,
    req_start_date,
    req_end_date,
    req_project_id,
    req_prior_id,
    req_status_id,
    req_type_id
  );
  if (result) res.send(result);
  else next();
};

//Validate user login
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { uname, upass } = req.body;
  const result = isValidLogin(uname, upass);
  if (result) res.send(result);
  else next();
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
    return res.status(400).json({
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
    return res.status(409).json({
      error_msg: "Username or params id invalid",
    });
  }
  return next();
};

export const validateParamsUserNameAndBodyTaskName = (
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
    return res.status(400).json({
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
  const result = isValidUser( req_username, req_password, name, birthday, email);
  if (result) res.send(result);
  else next();
};

export const validateEditUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, birthday, email, active } = req.body;
  if (!isValidEditUser(name, birthday, email, active)) return next();
};
export const validateUserCreateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;

  const result = !isValidUserCreateTask(
    name,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id
  );

  if (result) res.send(result);
  else next();
};
