import { Request, Response } from "express";
import { ITask } from "../interfaces/main";
import { statusArray } from "./status";
import { typeArray } from "./type";
import { priorArray } from "./priority";
import { projectArray } from "./project";

const taskArray: ITask[] = [];

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
    taskArray.push(tasks);
  }
  else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot create task",
    });
  }
  res.send(taskArray);
};

export { createTask };
