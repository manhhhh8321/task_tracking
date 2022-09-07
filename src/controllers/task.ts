
import { Request, Response } from "express";
import { ITask } from "../interfaces/main";
import { statusArray } from "./status";
import { typeArray } from "./type";
import { priorArray } from "./priority";
import { projectArray } from "./project";
import { userArray } from "./users";
import { isValidTask } from "../validators/valid";

export const taskArray: ITask[] = [];

const createTask = (req: Request, res: Response) => {
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
    (item) => item.username === assignee
  );

  if (assigneeIndex < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }


  if (projectIndex >= 0) {
    const tasks = {
      id: taskArray.length + 1,
      taskName: name,
      assignee: assignee,
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

export const editTask = (req: Request, res: Response) => {
  const req_task_id = req.params.id;
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

  const index = taskArray.findIndex(
    (item) => item.id === parseInt(req_task_id)
  );

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
  const req_id = (req.params.id);
  const index = taskArray.findIndex((item) => item.id === parseInt(req_id));

  if (index >= 0) {
    taskArray.splice(index, 1);
    res.send(taskArray);
  } else {
    return res.status(400).json({
      error_msg: "Cannot delete task",
    });
  }
};

export const viewAllTasks = (req: Request, res: Response) => {
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
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
  res.send(obj);
};
export { createTask };
