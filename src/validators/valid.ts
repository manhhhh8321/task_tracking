const validator = require("validator");

import { error } from "../middlewares/validations";

export const isValidProject = (name: any, start_date: any, end_date: any) => {
  const isValidName = validator.isNumeric(name);
  const isValidStartDate = validator.isDate(start_date, "YYYY-MM-DD");
  const isValidEndDate = validator.isDate(end_date, "YYYY-MM-DD");

  if (isValidName) return error.string_input_err("Name");
  if (!isValidStartDate || !isValidEndDate) return error.date_input_err;

  const d1 = new Date(start_date);
  const d2 = new Date(end_date);

  if (d1 > d2) return error.date_range_err;
};

export const isValidType = (name: any, reqColor: any) => {
  const isValidName = validator.isAlpha(name);
  const isValidColor = validator.isAlpha(reqColor);

  if (!isValidName) return error.string_input_err("Name");
  if (!isValidColor) return error.string_input_err("Color");
};

export const isValidStatus = (name: any, order: any) => {
  const isValidName = validator.isNumeric(name);
  const isValidOrder = validator.isNumeric(order, { min: 1, max: undefined });

  if (isValidName) return error.string_input_err("Name");
  if (!isValidOrder) return error.number_input_err("Order");
};

export const isValidTask = (
  name: any,
  assignee: any,
  req_start_date: any,
  req_end_date: any,
  req_project_id: any,
  req_prior_id: any,
  req_status_id: any,
  req_type_id: any
) => {
  const isValidName = validator.isNumeric(name);
  const isValidAssignee = validator.isAlphanumeric(assignee);
  const isValidStartDate = validator.isDate(req_start_date, "YYYY-MM-DD");
  const isValidEndDate = validator.isDate(req_end_date, "YYYY-MM-DD");
  const isValidProjectID = validator.isNumeric(req_project_id, {
    min: 1,
    max: undefined,
  });
  const isValidPriorID = validator.isNumeric(req_prior_id, {
    min: 1,
    max: undefined,
  });
  const isValidStatusID = validator.isNumeric(req_status_id, {
    min: 1,
    max: undefined,
  });
  const isValidTypeID = validator.isNumeric(req_type_id, {
    min: 1,
    max: undefined,
  });

  if (isValidName) return error.string_input_err("Name");
  if (!isValidAssignee) return error.string_input_err("Assignee");
  if (!isValidStartDate || !isValidEndDate) return error.date_input_err;
  if (!isValidProjectID) return error.number_input_err("Project ID");
  if (!isValidPriorID) return error.number_input_err("Priority ID");
  if (!isValidStatusID) return error.number_input_err("Status ID");
  if (!isValidTypeID) return error.number_input_err("Type ID");

  const d1 = new Date(req_start_date);
  const d2 = new Date(req_end_date);

  if (d1 > d2) return error.date_range_err;
};

export const isValidUser = (
  req_username: any,
  req_password: any,
  name: any,
  birthday: any,
  email: any
) => {
  const isValidUsername = validator.isAlphanumeric(req_username);
  const isValidPassword = validator.isEmpty(req_password);
  const isValidName = validator.isAlpha(name);
  const isValidBirthDay = validator.isDate(birthday, "YYYY-MM-DD");
  const isValidEmail = validator.isEmail(email);

  if (!isValidUsername) return error.string_input_err("Username");
  if (isValidPassword) return error.string_input_err("Password");
  if (!isValidName) return error.string_input_err("Name");
  if (!isValidBirthDay) return error.date_input_err;
  if (!isValidEmail) return error.email_input_err;
};

export const isValidLogin = (req_username: any, req_password: any) => {
  const isValidUsername = validator.isAlphanumeric(req_username);
  const isValidPassword = validator.isEmpty(req_password);

  if (!isValidUsername) return error.string_input_err("Username");
  if (isValidPassword) return error.string_input_err("Password");
};

export const isValidEditUser = (
  name: any,
  birthday: any,
  email: any,
  active: any
) => {
  const isValidName = validator.isAlpha(name);
  const isValidBirthDay = validator.isDate(birthday, "YYYY-MM-DD");
  const isValidEmail = validator.isEmail(email);
  const isValidActive = validator.isBoolean(active);

  if (!isValidName) return error.string_input_err("Name");
  if (!isValidBirthDay) return error.date_input_err;
  if (!isValidEmail) return error.email_input_err;
  if (!isValidActive) return error.boolean_input_err;
};

export const isValidUserCreateTask = (
  name: any,
  req_start_date: any,
  req_end_date: any,
  req_prior_id: any,
  req_status_id: any,
  req_type_id: any
) => {
  const isValidName = validator.isNumeric(name);
  const isValidStartDate = validator.isDate(req_start_date, "YYYY-MM-DD");
  const isValidEndDate = validator.isDate(req_end_date, "YYYY-MM-DD");
  const isValidPriorID = validator.isNumeric(req_prior_id, {
    min: 1,
    max: undefined,
  });
  const isValidStatusID = validator.isNumeric(req_status_id, {
    min: 1,
    max: undefined,
  });
  const isValidTypeID = validator.isNumeric(req_type_id, {
    min: 1,
    max: undefined,
  });

  if (isValidName) return error.string_input_err("Name");
  if (!isValidStartDate || !isValidEndDate) return error.date_input_err;
  if (!isValidPriorID) return error.number_input_err("Priority ID");
  if (!isValidStatusID) return error.number_input_err("Status ID");
  if (!isValidTypeID) return error.number_input_err("Type ID");

  const d1 = new Date(req_start_date);
  const d2 = new Date(req_end_date);

  if (d1 > d2) return error.date_range_err;
};
