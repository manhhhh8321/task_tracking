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
    return res.status(400).json({
      error_msg: "Project id or username invalid",
    });
  }

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(404).json({
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
    return res.status(400).json({
      error_msg: "Task input invalid",
    });
  }

  const statusIndex = statusArray.findIndex(
    (item) => item.id === parseInt(req_status_id)
  );
  const priorityIndex = priorArray.findIndex(
    (item) => item.id === parseInt(req_prior_id)
  );
  const typeIndex = typeArray.findIndex(
    (item) => item.id === parseInt(req_type_id)
  );
  const projectIndex = projectArray.findIndex(
    (item) => item.id === parseInt(req_project_id)
  );

  const assigneeIndex = userArray.findIndex(
    (item) => item.username === username
  );

  if (assigneeIndex < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (assignee === undefined || assignee === "") {
    assignee === "Me";
  }

  const req_start_date_valid = validateDate(req_start_date);
  const req_end_date_valid = validateDate(req_end_date);


  if (!req_start_date_valid || !req_end_date_valid) {
    return res.status(400).json({
      error_msg: "Date invalid",
    });
  }

  if (projectIndex >= 0) {
    const tasks = {
      id: taskArray.length + 1,
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
    return res.status(400).json({
      error_msg: "Cannot create task",
    });
  }
  res.send(taskArray);
};

export const userEditPrivateTask = (req: Request, res: Response) => {
  const project_id = parseInt(req.params.projectid);
  const username = req.params.username;
  const task_id = parseInt(req.params.taskid);

  if (
    !isValidStatus(username, project_id) ||
    validator.isInt(task_id, { min: 1, max: undefined })
  ) {
    return res.status(400).json({
      error_msg: "Request id or username invalid",
    });
  }

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(404).json({
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


  const statusIndex = statusArray.findIndex(
    (item) => item.id === parseInt(req_status_id)
  );
  const priorityIndex = priorArray.findIndex(
    (item) => item.id === parseInt(req_prior_id)
  );
  const typeIndex = typeArray.findIndex(
    (item) => item.id === parseInt(req_type_id)
  );
  const projectIndex = projectArray.findIndex(
    (item) => item.id === project_id
  );
  const userIndex = userArray.findIndex((item) => item.username === username);

  if (assignee === "" || assignee === undefined) {
    assignee = "Me";
  }

  const index = taskArray.findIndex((item) => item.id === task_id);

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

  if (assignee === username) {
    userArray[userIndex].task[task_id] === name;
  }
  projectArray[projectIndex].tasks[task_id] === name;
  res.send(taskArray[index]);
};

export const userDeletePrivateTask = (req: Request, res: Response) => {
  const username = req.params.username;
  const task_id = req.params.taskid;

  if (validator.isNumeric(username) || !validator.isInt(task_id, { min: 1 })) {
    return res.status(400).json({
      error_msg: "Username or task name incorrect",
    });
  }

  const userIndex = userArray.findIndex((item) => item.username === username);

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  const taskIndex = userArray[userIndex].task.findIndex(
    (item) => item === task_id
  );
  const taskArrIndex = taskArray.findIndex((item) => item.assignee === username);

  if (isUserInProject < 0) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  if (taskArrIndex >= 0) {
    userArray[userIndex].task.splice(taskIndex, 1);
    taskArray[taskArrIndex].assignee === "";
  } else {
    return res.status(400).json({
      error_msg: "Cannot delete task",
    });
  }
  res.send(`Deleted, user's tasks now remain: ${userArray[userIndex].task}`);
};

export const allUserTask = (req: Request, res: Response) => {
  const user_id = req.params.userid;

  if (!validator.isInt(user_id, { min: 1, max: undefined })) {
    return res.status(400).json({
      error_msg: "Request id invalid",
    });
  }

  const userIndex = userArray.findIndex(
    (item) => item.id === parseInt(user_id)
  );

  if (userIndex >= 0) {
    res.send(`All tasks: ${userArray[userIndex].task}`);
  } else {
    return res.status(404).json({
      error_msg: "User not found",
    });
  }
};
