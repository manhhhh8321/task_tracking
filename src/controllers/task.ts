import { Request, Response } from "express";
import { ITask } from "../interfaces/main";
import { AppDataSource } from "../data-source";
import { Status, Priority, Task, Type, User, Project } from "../entity/main";

export const taskArray: ITask[] = [];

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

  const allUsers = await userRepo.find();
  const allProjects = await projectRepo.find();
  const allStatus = await statusRepo.find();
  const allPrior = await priorRepo.find();
  const allType = await typeRepo.find();

  const userIndex = allUsers.findIndex((item) => item.username === assignee);
  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(req_project_id)
  );
  const statusIndex = allStatus.findIndex(
    (item) => item.id === parseInt(req_status_id)
  );
  const priorIndex = allPrior.findIndex(
    (item) => item.id === parseInt(req_prior_id)
  );
  const typeIndex = allType.findIndex(
    (item) => item.id === parseInt(req_type_id)
  );

  if (userIndex < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (projectIndex < 0) {
    return res.status(400).json({
      error_msg: "Cannot create task",
    });
  }
  // Create new query builder instance for the task table
  const task = new Task();
  task.taskName = name;
  task.start_date = req_start_date;
  task.end_date = req_end_date;
  task.project = allProjects[projectIndex];
  task.type = allType[typeIndex];
  task.status = allStatus[statusIndex];
  task.priority = allPrior[priorIndex];
  task.assignee = allUsers[userIndex].username;

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

  const allUsers = await userRepo.find();
  const allProjects = await projectRepo.find();
  const allStatus = await statusRepo.find();
  const allPrior = await priorRepo.find();
  const allType = await typeRepo.find();
  const allTasks = await taskRepo.find();

  const userIndex = allUsers.findIndex((item) => item.username === assignee);
  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(req_project_id)
  );
  const statusIndex = allStatus.findIndex(
    (item) => item.id === parseInt(req_status_id)
  );
  const priorIndex = allPrior.findIndex(
    (item) => item.id === parseInt(req_prior_id)
  );
  const typeIndex = allType.findIndex(
    (item) => item.id === parseInt(req_type_id)
  );
  const taskIndex = allTasks.findIndex(
    (item) => item.id === parseInt(req_task_id)
  );

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

  // Create new query builder instance to update the task table
  const query = AppDataSource.createQueryBuilder()
    .update(Task)
    .set({
      taskName: name,
      start_date: req_start_date,
      end_date: req_end_date,
      project: allProjects[projectIndex],
      type: allType[typeIndex],
      status: allStatus[statusIndex],
      priority: allPrior[priorIndex],
      assignee: allUsers[userIndex].username,
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
  const allTasks = await taskRepo.find();
  const index = allTasks.findIndex((item) => item.id === parseInt(req_id));

  if (index < 0) {
    return res.status(400).json({
      error_msg: "Cannot delete task",
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
  const allTasks = await taskRepo.find({relations: ["project", "type", "status", "priority"]});
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
