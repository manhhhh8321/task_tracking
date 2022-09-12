import { Users } from "../interfaces/main";
import { Request, Response } from "express";
import { projectArray } from "./project";
import { taskArray } from "./task";
import { statusArray } from "./status";
import { priorArray } from "./priority";
import { typeArray } from "./type";

import { AppDataSource } from "../data-source";
import { Status, Priority, Task, Type, User, Project } from "../entity/main";
import { EntityManager } from "typeorm";

const userRepo = AppDataSource.getRepository(User);
const projectRepo = AppDataSource.getRepository(Project);
const taskRepo = AppDataSource.getRepository(Task);
const statusRepo = AppDataSource.getRepository(Status);
const priorRepo = AppDataSource.getRepository(Priority);
const typeRepo = AppDataSource.getRepository(Type);

export const userJoinedProject = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  const allUsers = await userRepo.find();

  const userIndex = allUsers.findIndex((item) => item.id === userId);

  if (userIndex >= 0) {
    res.send(
      `All projects of ${allUsers[userIndex].username}: ${allUsers[userIndex].allProjects}`
    );
  } else {
    return res.status(404).json({
      error_msg: "User not found",
    });
  }
};

export const userDetailProject = async (req: Request, res: Response) => {
  const username = req.params.username;
  const projectId = req.params.id;

  const allProjects = await projectRepo.find();
  const allUsers = await userRepo.find();

  const pushArray = [];
  const isUserInProject = allProjects.findIndex((item) =>
    item.members.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  const userIndex = allUsers.findIndex((item) => item.username === username);
  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(projectId)
  );

  // Find task by username and project id
  const allTasks = await taskRepo.find({
    relations: ["project", "status", "priority", "type"],
  });

  // Count number of records in task where assignee = username and project id = projectId
  const countTask = allTasks.filter(
    (item) =>
      item.assignee === username && item.project.id === parseInt(projectId)
  ).length;

  if (userIndex >= 0 && projectIndex >= 0) {
    const currentTask = countTask;
    const closedTask = allProjects[projectIndex].task_closed.length;
    const obj = {
      projectName: allProjects[projectIndex].projectName,
      allTasks: currentTask + closedTask,
      closedTasks: closedTask,
      // Check process if it is number or not, if not then return 0
      process: isNaN((closedTask / currentTask) * 100)
        ? 0
        : (closedTask / currentTask) * 100,
      start_date: allProjects[projectIndex].start_date,
      end_date: allProjects[projectIndex].end_date,
    };
    pushArray.push(obj);
  }
  res.send(pushArray);
};

export const allTaskOfUserProject = async (req: Request, res: Response) => {
  const username = req.params.username;
  const projectId = req.params.id;

  const allProjects = await projectRepo.find();
  const allStatus = await statusRepo.find();
  const allTasks = await taskRepo.find({ relations: ["status"] });

  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(projectId)
  );

  const isUserInProject = allProjects[projectIndex].members.includes(username);

  if (!isUserInProject) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  const statusArr = allStatus.map((item) => item.statusName);
  const obj: Record<string, any> = {};

  statusArr.forEach((el) => {
    obj[el] = [];
  });

  allTasks.forEach((element) => {
    if (element.assignee === username) {
      const temp = element.status.statusName;
      obj[`${temp}`].push(element);
    }
  });

  if (!obj) {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
  res.send(obj);
};

export const createTaskForUser = async (req: Request, res: Response) => {
  const req_project_id = req.params.id;
  const username = req.params.username;

  const allProjects = await projectRepo.find();
  const allUsers = await userRepo.find();
  const allStatus = await statusRepo.find();
  const allPrior = await priorRepo.find();
  const allType = await typeRepo.find();

  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(req_project_id)
  );

  const isUserInProject = allProjects[projectIndex].members.includes(username);

  if (!isUserInProject) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  const {
    name,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;

  const statusIndex = allStatus.findIndex(
    (item) => item.id === parseInt(req_status_id)
  );
  const priorityIndex = allPrior.findIndex(
    (item) => item.id === parseInt(req_prior_id)
  );
  const typeIndex = allType.findIndex(
    (item) => item.id === parseInt(req_type_id)
  );

  const assigneeIndex = allUsers.findIndex(
    (item) => item.username === username
  );

  if (assigneeIndex < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (projectIndex < 0) {
    return res.status(409).json({
      error_msg: "Cannot create task",
    });
  }

  const tasks = {
    id: taskArray.length + 1,
    taskName: name,
    assignee: username,
    start_date: req_start_date,
    end_date: req_end_date,
    project: allProjects[projectIndex],
    type: allType[typeIndex],
    status: allStatus[statusIndex],
    priority: allPrior[priorityIndex],
  };

  // Create transaction to create new tasks then update user id in task table
  await AppDataSource.createEntityManager().transaction(
    async (transactionalEntityManager) => {
      const newTask = new Task();
      newTask.taskName = tasks.taskName;
      newTask.assignee = tasks.assignee;
      newTask.start_date = tasks.start_date;
      newTask.end_date = tasks.end_date;
      newTask.project = tasks.project;
      newTask.type = tasks.type;
      newTask.status = tasks.status;
      newTask.priority = tasks.priority;

      await transactionalEntityManager.save(newTask);

      const task = await transactionalEntityManager.findOne(Task, {
        where: { assignee: username },
        relations: ["project", "status", "priority", "type", "user"],
      });

      // Update user id in task table
      if (task) {
        task.user = allUsers[assigneeIndex];

        await transactionalEntityManager.save(task);
      }

      return res.status(201).json({
        success_msg: "Create task successfully",
      });
    }
  );
};

export const userEditTask = async (req: Request, res: Response) => {
  const project_id = req.params.project_id;
  const username = req.params.username;
  const task_id = parseInt(req.params.task_id);

  const allProjects = await projectRepo.find();
  const allUsers = await userRepo.find();
  const allStatus = await statusRepo.find();
  const allPrior = await priorRepo.find();
  const allType = await typeRepo.find();
  const allTasks = await taskRepo.find();

  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(project_id)
  );
  const isUserInProject = allProjects[projectIndex].members.includes(username);

  if (!isUserInProject) {
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

  const statusIndex = allStatus.findIndex(
    (item) => item.id === parseInt(req_status_id)
  );
  const priorityIndex = allPrior.findIndex(
    (item) => item.id === parseInt(req_prior_id)
  );
  const typeIndex = allType.findIndex(
    (item) => item.id === parseInt(req_type_id)
  );

  const userIndex = allUsers.findIndex((item) => item.username === username);
  const taskIndex = allTasks.findIndex((item) => item.id === task_id);

  if (taskIndex < 0) {
    return res.status(404).json({
      error_msg: "Cannot find task",
    });
  }

  if (userIndex < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (projectIndex < 0) {
    return res.status(409).json({
      error_msg: "Cannot find project",
    });
  }

  // Create new  query builder ti update task for user, project, user
  const transaction = await AppDataSource.transaction(async (manager) => {
    const task = allTasks[taskIndex];

    if (task) {
      task.taskName = name;
      task.assignee = assignee;
      task.start_date = req_start_date;
      task.end_date = req_end_date;
      task.type = allType[typeIndex];
      task.status = allStatus[statusIndex];
      task.priority = allPrior[priorityIndex];
      await manager.save(task);
    }

    return task;
  });

  if (!transaction) {
    return res.status(409).json({
      error_msg: "Cannot update task",
    });
  }
  res.send(transaction);
};

export const userDeleteTask = async (req: Request, res: Response) => {
  const username = req.params.username;
  const task_id = req.params.task_id;
  const project_id = req.body.project_id;

  const allUsers = await userRepo.find();
  const allTasks = await taskRepo.find();
  const allProjects = await projectRepo.find();

  const userIndex = allUsers.findIndex((item) => item.username === username);
  const projectIndex = allProjects.findIndex( (item) => item.id === parseInt(project_id));

  const isUserInProject = allProjects[projectIndex].members.findIndex((item) =>
    item.includes(username)
  );  

  const taskIndex = allTasks.findIndex((item) => item.id === parseInt(task_id));

  const taskArrIndex = allTasks.findIndex((item) => item.assignee === username);

  if (isUserInProject < 0) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  if (taskArrIndex < 0) {
    return res.status(400).json({
      status_code: 0,
      error_msg: "Cannot delete task",
    });
  }

  // Delete task of user then update project, task
  const transaction = await AppDataSource.transaction(async (manager) => {
    const task = allTasks[taskIndex];

    if (task) {
      await manager.remove(task);
    }
    return task;
  });

  if (!transaction) {
    return res.status(400).json({
      error_msg: "Cannot delete task",
    });
  }
  res.send(`Delete task successfully`);
};
