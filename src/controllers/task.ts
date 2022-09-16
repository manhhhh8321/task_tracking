import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

import {
  Status,
  Priority,
  Task,
  Type,
  User,
  Project,
  Admin,
} from "../entity/main";

const createTask = async (req: Request, res: Response) => {
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

  const statusRepo = AppDataSource.getRepository(Status);
  const priorRepo = AppDataSource.getRepository(Priority);
  const taskRepo = AppDataSource.getRepository(Task);
  const typeRepo = AppDataSource.getRepository(Type);
  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);
  const adminRepo = AppDataSource.getRepository(Admin);

  const status = await statusRepo.findOne({ where: { id: req_status_id } });
  const prior = await priorRepo.findOne({ where: { id: req_prior_id } });
  const type = await typeRepo.findOne({ where: { id: req_type_id } });
  const assigneeUser = await userRepo.findOne({
    where: { username: assignee },
  });
  const project = await projectRepo.findOne({ where: { id: req_project_id } });
  const admin = await adminRepo.findOne({ where: { username: assignee } });

  if (!assigneeUser && !admin) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (!project) {
    return res.status(400).json({
      error_msg: "Cannot create task",
    });
  }

  const defaultStatuses = await statusRepo.findOne({
    where: { isDefault: true },
  });

  // Create new query builder instance for the task table
  const task = new Task();
  task.taskName = name;
  task.start_date = req_start_date;
  task.end_date = req_end_date;
  task.project = project;
  task.type = type!;
  
  if (!status) {
    task.status = defaultStatuses!;
  } else {
    task.status = status!;
  }

  if (admin) {
    task.assignee = admin.username;
    task.user = admin;
  } else {
    task.assignee = assigneeUser!.username;
    task.user = assigneeUser!;
  }
  task.priority = prior!;

  const rs = await taskRepo.save(task);

  if (!rs) {
    return res.status(400).json({
      error_msg: "Cannot create task",
    });
  }
  res.send(rs);
};

export const editTask = async (req: Request, res: Response) => {
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

  const statusRepo = AppDataSource.getRepository(Status);
  const priorRepo = AppDataSource.getRepository(Priority);
  const taskRepo = AppDataSource.getRepository(Task);
  const typeRepo = AppDataSource.getRepository(Type);
  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);

  const status = await statusRepo.findOne({ where: { id: req_status_id } });
  const prior = await priorRepo.findOne({ where: { id: req_prior_id } });
  const type = await typeRepo.findOne({ where: { id: req_type_id } });
  const assigneeUser = await userRepo.findOne({ where: { id: assignee } });
  const project = await projectRepo.findOne({ where: { id: req_project_id } });

  if (!assigneeUser) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (!project || !status || !prior || !type) {
    return res.status(400).json({
      error_msg: "Project || Status || Priority || Type not found",
    });
  }

  // Create new query builder instance to update the task table
  const query = AppDataSource.createQueryBuilder()
    .update(Task)
    .set({
      taskName: name,
      start_date: req_start_date,
      end_date: req_end_date,
      project: project,
      type: type,
      status: status,
      priority: prior,
      assignee: assigneeUser.username,
      user: assigneeUser,
    })
    .where("id = :id", { id: parseInt(req_task_id) });

  const rs = await query.execute();

  if (!rs) {
    return res.status(400).json({
      error_msg: "Cannot update task",
    });
  }
  res.send(`Task ${req_task_id} updated`);
};

export const deleteTask = async (req: Request, res: Response) => {
  const req_id = req.params.id;

  const taskRepo = AppDataSource.getRepository(Task);

  const task = await taskRepo.findOne({ where: { id: parseInt(req_id) } });

  if (!task) {
    return res.status(404).json({
      error_msg: "Cannot find task",
    });
  }
  // Create new query builder to delete task by req_id
  const query = taskRepo
    .createQueryBuilder()
    .delete()
    .from(Task)
    .where("id = :id", { id: parseInt(req_id) });

  const rs = await query.execute();

  if (!rs) {
    return res.status(400).json({
      error_msg: "Cannot delete task",
    });
  }
  res.send(`Task ${req_id} deleted`);
};

export const viewAllTasks = async (req: Request, res: Response) => {
  const obj: Record<string, any> = {};

  const taskRepo = AppDataSource.getRepository(Task);
  const allTasks = await taskRepo.find({
    relations: ["project", "type", "status", "priority"],
  });
  const allStatus = await AppDataSource.getRepository(Status).find();
  const statusArr = allStatus.map((item) => item.statusName);

  statusArr.forEach((el) => {
    obj[el] = [];
  });

  allTasks.forEach((element) => {
    const temp = element.status.statusName;
    obj[`${temp}`].push(element);
  });

  if (!obj) {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
  res.send(obj);
};
export { createTask };
