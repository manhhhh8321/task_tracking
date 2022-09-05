const validator = require("validator");
const validateDate = require("is-valid-date");

import { Request, Response } from "express";
import { projectArray } from "./project";
import { taskArray } from "./task";
import { statusArray } from "./status";
import { priorArray } from "./priority";
import { typeArray } from "./type";
import { userArray } from "./users";
import { isValidTask, isValidStatus } from "../validators/valid";

export const userCreatePrivateTask = (req: Request, res: Response) => {
  const req_project_id = req.body.projectid;
  const username = req.params.username;

  if (!isValidStatus(username, req_project_id)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Projectid or username invalid",
    });
  }

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not in project",
    });
  }

  const {
    name,
    assignee,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;

  if (
    !isValidTask(
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
    return res.status(403).json({
      status_code: 0,
      error_msg: "Task input invalid",
    });
  }

  const statusIndex = statusArray.findIndex(
    (item) => item.statusID == parseInt(req_status_id)
  );
  const priorityIndex = priorArray.findIndex(
    (item) => item.priorID == parseInt(req_prior_id)
  );
  const typeIndex = typeArray.findIndex(
    (item) => item.typeID == parseInt(req_type_id)
  );
  const projectIndex = projectArray.findIndex(
    (item) => item.projectID == parseInt(req_project_id)
  );

  const assigneeIndex = userArray.findIndex(
    (item) => item.username == username
  );

  if (assigneeIndex < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find user",
    });
  }

  if (assignee == undefined || assignee == "") {
    assignee == "Me";
  }

  const req_start_date_valid = validateDate(req_start_date);
  const req_end_date_valid = validateDate(req_end_date);

  const start_dateByProjectID = new Date(projectArray[projectIndex].start_date);
  const end_dateByProjectID = new Date(projectArray[projectIndex].end_date);

  if (!req_start_date_valid || !req_end_date_valid) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Date invalid",
    });
  }

  // const diff1 = new DateDiff(start_dateByProjectID, req_start_date);
  // const diff2 = new DateDiff(end_dateByProjectID, req_end_date);

  // if (diff1.days() < 0 || diff2.days() < 0) {
  //   return res.status(403).json({
  //     status_code: 0,
  //     error_msg: "Date invalid",
  //   });
  // }

  if (projectIndex >= 0) {
    const tasks = {
      taskID: taskArray.length + 1,
      taskName: name,
      assignee: username,
      start_date: req_start_date,
      end_date: req_end_date,
      project: projectArray[projectIndex],
      type: typeArray[typeIndex],
      status: statusArray[statusIndex],
      priority: priorArray[priorityIndex],
    };
    userArray[assigneeIndex].task.push(tasks.taskName);
    projectArray[projectIndex].tasks.push(tasks.taskName);
    taskArray.push(tasks);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot create task",
    });
  }
  res.send(taskArray);
};

export const userEditPrivateTask = (req: Request, res: Response) => {
  const projectid = parseInt(req.params.projectid);
  const username = req.params.username;
  const taskid = parseInt(req.params.taskid);

  if (
    !isValidStatus(username, projectid) ||
    validator.isInt(taskid, { min: 1, max: undefined })
  ) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Request id or username invalid",
    });
  }

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not in project",
    });
  }
  let assignee: string = "";
  const {
    name,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;

  const req_start_date_valid = validateDate(req_start_date);
  const req_end_date_valid = validateDate(req_end_date);

  const statusIndex = statusArray.findIndex(
    (item) => item.statusID == parseInt(req_status_id)
  );
  const priorityIndex = priorArray.findIndex(
    (item) => item.priorID == parseInt(req_prior_id)
  );
  const typeIndex = typeArray.findIndex(
    (item) => item.typeID == parseInt(req_type_id)
  );
  const projectIndex = projectArray.findIndex(
    (item) => item.projectID == projectid
  );
  const userIndex = userArray.findIndex((item) => item.username == username);

  if (assignee == "" || assignee == undefined) {
    assignee = "Me";
  }

  if (!req_start_date_valid || !req_end_date_valid) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Date invalid",
    });
  }

  const index = taskArray.findIndex((item) => item.taskID == taskid);

  if (index >= 0) {
    taskArray[index].taskName = name;
    taskArray[index].assignee = assignee;
    taskArray[index].start_date = req_start_date;
    taskArray[index].end_date = req_end_date;
    taskArray[index].project = projectArray[projectIndex];
    taskArray[index].priority = priorArray[priorityIndex];
    taskArray[index].status = statusArray[statusIndex];
    taskArray[index].type = typeArray[typeIndex];
  }

  if (assignee == username) {
    userArray[userIndex].task[taskid] == name;
  }
  projectArray[projectIndex].tasks[taskid] == name;
  res.send(taskArray[index]);
};

export const userDeletePrivateTask = (req: Request, res: Response) => {
  const username = req.params.username;
  const taskName = req.body.taskname;

  if (validator.isNumeric(username) || validator.isNumeric(taskName)) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Username or taskname incorrect",
    });
  }

  const userIndex = userArray.findIndex((item) => item.username == username);

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  const taskIndex = userArray[userIndex].task.findIndex(
    (item) => item == taskName
  );
  const taskArrIndex = taskArray.findIndex((item) => item.assignee == username);

  if (isUserInProject < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not in project",
    });
  }

  if (taskArrIndex >= 0) {
    userArray[userIndex].task.splice(taskIndex, 1);
    taskArray[taskArrIndex].assignee == "";
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot delete task",
    });
  }
  res.send(`Deleted, user's tasks now remain: ${userArray[userIndex].task}`);
};

export const allUserTask = (req: Request, res: Response) => {
  const userid = req.params.userid;

  if (!validator.isInt(userid, { min: 1, max: undefined })) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Request id invalid",
    });
  }

  const userIndex = userArray.findIndex(
    (item) => item.userID == parseInt(userid)
  );

  if (userIndex >= 0) {
    res.send(`All tasks: ${userArray[userIndex].task}`);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not found",
    });
  }
};
