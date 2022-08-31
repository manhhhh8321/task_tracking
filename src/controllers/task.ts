const validateDate = require("is-valid-date");
import DateDiff from "date-diff";

import { Request, Response } from "express";
import { ITask } from "../interfaces/main";
import { statusArray } from "./status";
import { typeArray } from "./type";
import { priorArray } from "./priority";
import { projectArray } from "./project";
import { Users } from "../interfaces/main";
import { userArray } from "./users";

export const taskArray: ITask[] = [];

const createTask = (req: Request, res: Response) => {
  const {
    name,
    assignee,
    req_start_date,
    req_end_date,
    reqProjectid,
    reqPriorid,
    reqStatusid,
    reqTypeid,
  } = req.body;

  const statusIndex = statusArray.findIndex(
    (item) => item.statusID == parseInt(reqStatusid)
  );
  const priorityIndex = priorArray.findIndex(
    (item) => item.priorID == parseInt(reqPriorid)
  );
  const typeIndex = typeArray.findIndex(
    (item) => item.typeID == parseInt(reqTypeid)
  );
  const projectIndex = projectArray.findIndex(
    (item) => item.projectID == parseInt(reqProjectid)
  );

  const assigneeIndex = userArray.findIndex(item => item.username == assignee);

  if (assigneeIndex < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find user",
    });
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
      assignee: assignee || "me",
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

export const editTask = (req: Request, res: Response) => {
  const reqTaskID = parseInt(req.params.id);
  const {
    name,
    assignee,
    req_start_date,
    req_end_date,
    reqProjectid,
    reqPriorid,
    reqStatusid,
    reqTypeid,
  } = req.body;

  const req_start_date_valid = validateDate(req_start_date);
  const req_end_date_valid = validateDate(req_end_date);

  const statusIndex = statusArray.findIndex(
    (item) => item.statusID == parseInt(reqStatusid)
  );
  const priorityIndex = priorArray.findIndex(
    (item) => item.priorID == parseInt(reqPriorid)
  );
  const typeIndex = typeArray.findIndex(
    (item) => item.typeID == parseInt(reqTypeid)
  );
  const projectIndex = projectArray.findIndex(
    (item) => item.projectID == parseInt(reqProjectid)
  );

  if (!req_start_date_valid || !req_end_date_valid) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Date invalid",
    });
  }

  const index = taskArray.findIndex((item) => item.taskID == reqTaskID);

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
  res.send(taskArray[index]);
};

export const deleteTask = (req: Request, res: Response) => {
  const reqID = parseInt(req.params.id);
  const index = taskArray.findIndex((item) => item.taskID == reqID);

  if (index >= 0) {
    taskArray.splice(index, 1);
    res.send(taskArray);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot delete task",
    });
  }
};

export const viewAllTasks = (req: Request, res: Response) => {
  const viewArray = [];
  const obj: Record<string, any> = {};
  const statusArr = statusArray.map((item) => item.statusName);

  statusArr.forEach((element) => {
    obj[element] = [];
  });

  for (let i = 0; i < taskArray.length; i++) {
    const temp = taskArray[i].status.statusName;
    obj[`${temp}`].push(taskArray[i]);
  }

  if (!obj) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Something wrong",
    });
  }
  res.send(obj);
};
export { createTask };
