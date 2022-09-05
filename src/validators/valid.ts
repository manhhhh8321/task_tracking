const validator = require("validator");

export const isValidProject = (name: any, start_date: any, end_date: any) => {
  const isValidName = validator.isNumeric(name);
  const isValidStartDate = validator.isDate(start_date, "MM-DD-YYYY");
  const isValidEndDate = validator.isDate(end_date, "MM-DD-YYYY");

  if (!isValidName && isValidStartDate && isValidEndDate) return true;
  return false;
};

export const isValidType = (name: any, reqColor: any) => {
  const isValidName = validator.isNumeric(name);
  const isValidColor = validator.isAlpha(reqColor);
  if (!isValidName && isValidColor) return true;
  return false;
};

export const isValidStatus = (name: any, order: any) => {
  const isValidName = validator.isNumeric(name);
  const isValidOrder = validator.isInt(order, { min: 1 });

  if (!isValidName && isValidOrder) return true;
  return false;
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
  const isValidAssignee = validator.isNumeric(assignee);
  const isValidStartDate = validator.isNumeric(req_start_date);
  const isValidEndDate = validator.isNumeric(req_end_date);
  const isValidProjectID = validator.isNumeric(req_project_id);
  const isValidPriorID = validator.isNumeric(req_prior_id);
  const isValidStatusID = validator.isNumeric(req_status_id);
  const isValidTypeID = validator.isNumeric(req_type_id);

  if (
    !isValidName &&
    !isValidAssignee &&
    !isValidStartDate &&
    !isValidEndDate &&
    isValidProjectID &&
    isValidPriorID &&
    isValidStatusID &&
    isValidTypeID
  )
    return true;
  return false;
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
  const isValidName = validator.isNumeric(name);
  const isValidBirthDay = validator.isDate(birthday, "MM-DD-YYYY");
  const isValidEmail = validator.isEmail(email);

  if (
    isValidUsername &&
    !isValidPassword &&
    !isValidName &&
    isValidBirthDay &&
    isValidEmail
  )
    return true;
  return false;
};
