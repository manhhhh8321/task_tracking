const validator = require("validator");
const uniqid = require("uniqid");
const validateDate = require("is-valid-date");

import { Users } from "../interfaces/main";
import { Request, Response } from "express";
import { projectArray } from "./project";
import { taskArray } from "./task";
import { statusArray } from "./status";
import { priorArray } from "./priority";
import { typeArray } from "./type";

export const userArray: Users[] = [];

export const inviteIdList: string[] = [];

export const createInviteID = (req: Request, res: Response) => {
  const newId = uniqid();
  inviteIdList.push(newId);
  res.send(newId);
};

export const createUser = (req: Request, res: Response) => {
  const { req_username, req_password, req_inviteID, name, birthday, email } =
    req.body;

  const validEmail = validator.isEmail(email);
  const validBirthday = validator.isDate(birthday, "MM-DD-YYYY");

  if (!validEmail || !validBirthday) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Date or email invalid",
    });
  }

  const index = userArray.findIndex((item) => item.username == req_username);

  if (index >= 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User already exists",
    });
  }
  const inviteIdIndex = inviteIdList.indexOf(req_inviteID);

  if (inviteIdIndex < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "InviteID invalid",
    });
  }

  const users: Users = {
    userID: userArray.length + 1,
    username: req_username,
    password: req_password,
    name: name,
    birthday: birthday,
    email: email,
    inviteID: req_inviteID,
    active: true,
    defaultProject: projectArray[0].projectName,
    allProjects: [],
    project: projectArray[0],
    task: [],
  };

  if (userArray.push(users)) {
    inviteIdList.splice(inviteIdIndex, 1);
  }
  res.send(userArray);
};

export const viewAllUser = (req: Request, res: Response) => {
  res.send(userArray);
};

export const viewUserDetail = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);

  if (userArray.length < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not exists",
    });
  }

  const userIndex = userArray.findIndex((item) => item.userID == userid);

  res.send(`${userArray[userIndex].allProjects}\n${userArray[userIndex].task}`);
};

export const deleteUser = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);

  if (userArray.length < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find any user",
    });
  }
  const userIndex = userArray.findIndex((item) => item.userID == userid);

  if (userIndex >= 0) {
    userArray.splice(userIndex, 1);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot delete user",
    });
  }
  res.send(`Deleted`);
};

export const editUser = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);
  const { name, birthday, email, active } = req.body;

  if (userArray.length < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find any user",
    });
  }

  const validEmail = validator.isEmail(email);
  const validBirthday = validator.isDate(birthday, "MM-DD-YYYY");

  if (!validEmail || !validBirthday) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Date or email invalid",
    });
  }

  const valid_active = validator.isBoolean(active);
  if (!valid_active) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Active state not correct",
    });
  }

  const userIndex = userArray.findIndex((item) => item.userID == userid);

  userArray[userIndex].name = name;
  userArray[userIndex].birthday = birthday;
  userArray[userIndex].email = email;
  userArray[userIndex].active = active;
  res.send(`Updated user ${name}`);
};

export const userLogin = (req: Request, res: Response) => {
  const { uname, upass } = req.body;
  const userIndex = userArray.findIndex((item) => item.username == uname);

  if (userIndex > 0) {
    if (
      uname == userArray[userIndex].username &&
      upass == userArray[userIndex].password &&
      userArray[userIndex].active != false
    ) {
      return res.send("Logged in");
    } else {
      return res.status(403).json({
        status_code: 0,
        error_msg: "Username or password incorrect",
      });
    }
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not found",
    });
  }
};

export const userJoinedProject = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);
  const userIndex = userArray.findIndex((item) => item.userID == userid);

  if (userIndex >= 0) {
    res.send(
      `All projects of ${userArray[userIndex].username}: ${userArray[userIndex].allProjects}`
    );
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not found",
    });
  }
};

export const userDetailProject = (req: Request, res: Response) => {
  const username = req.params.username;
  const projectid = parseInt(req.params.projectid);

  const pushArray = [];
  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not in project",
    });
  }
  const userIndex = userArray.findIndex((item) => item.username == username);
  const projectIndex = projectArray.findIndex(
    (item) => item.projectID == projectid
  );

  if (userIndex >= 0 && projectIndex >= 0) {
    const currentTask = userArray[userIndex].project.tasks.length;
    const closedTask = userArray[userIndex].project.task_closed.length;
    const obj = {
      projectName: projectArray[projectIndex].projectName,
      allTasks: currentTask + closedTask,
      process: currentTask / (currentTask + closedTask),
      start_date: userArray[userIndex].project.start_date,
      end_date: userArray[userIndex].project.end_date,
    };
    pushArray.push(obj);
  }
  res.send(pushArray);
};

export const allTaskOfUserProject = (req: Request, res: Response) => {
  const username = req.params.username;
  const projectid = req.body.projectid;

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );


  if (isUserInProject < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not in project",
    });
  }

  const projectIndex = projectArray.findIndex(
    (item) => item.projectID == projectid
  );

  const statusArr = statusArray.map((item) => item.statusName);
  const obj: Record<string, any> = {};

  statusArr.forEach((element) => {
    obj[element] = [];
  });

  for (let i = 0; i < projectArray[projectIndex].tasks.length; i++) {
    const temp = taskArray[i].status.statusName;
    obj[`${temp}`].push(projectArray[projectIndex].tasks[i]);
  }

  if (!obj) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Something wrong",
    });
  }
  res.send(obj);
};

export const createTaskForUser = (req: Request, res: Response) => {
  const reqProjectid = req.params.projectid;
  const username = req.params.username;

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
    req_start_date,
    req_end_date,
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

  const assigneeIndex = userArray.findIndex(
    (item) => item.username == username
  );

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

export const userEditTask = (req: Request, res: Response) => {
  const projectid = req.params.projectid;
  const username = req.params.username;

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not in project",
    });
  }
  const reqTaskID = parseInt(req.params.id);
  const {
    name,
    assignee,
    req_start_date,
    req_end_date,
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
    (item) => item.projectID == parseInt(projectid)
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

export const userDeleteTask = (req: Request, res: Response) => {
  const username = req.params.username;
  const projectid = parseInt(req.params.id);
  const taskid = parseInt(req.params.taskid);
  const taskIndex = taskArray.findIndex((item) => item.taskID == taskid);
  const projectIndex = projectArray.findIndex(
    (item) => item.projectID == projectid
  );
  const userIndex = userArray.findIndex((item) => item.username == username);

  const isUserInProject = projectArray.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not in project",
    });
  }

  if (taskIndex >= 0 && projectIndex >= 0 && userIndex >= 0) {
    userArray[userIndex].project.tasks.splice(taskIndex, 1);
    res.send(taskArray);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot delete task",
    });
  }
};

export const allUserTask = (req: Request, res: Response) => {
  const userid = parseInt(req.params.userid);

  const userIndex = userArray.findIndex((item) => item.userID == userid);

  if (userIndex >= 0) {
    res.send(`All tasks ${userArray[userIndex].task}`);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "User not found",
    });
  }
};