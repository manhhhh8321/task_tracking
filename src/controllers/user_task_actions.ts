import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Project, User, Status, Task, Type, Priority } from "../entity/main";

const projectRepo = AppDataSource.getRepository(Project);
const userRepo = AppDataSource.getRepository(User);
const statusRepo = AppDataSource.getRepository(Status);
const taskRepo = AppDataSource.getRepository(Task);
const typeRepo = AppDataSource.getRepository(Type);
const priorRepo = AppDataSource.getRepository(Priority);

export const userCreatePrivateTask = async (req: Request, res: Response) => {
  const project_id = req.body.req_project_id;
  const username = req.params.username;

  let assignee = req.body.assignee;

  const {
    name,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;

  const status = await statusRepo.findOne({ where: { id: req_status_id } });
  const prior = await priorRepo.findOne({ where: { id: req_prior_id } });
  const type = await typeRepo.findOne({ where: { id: req_type_id } });
  const assigneeUser = await userRepo.findOne({
    where: { username: assignee },
  });
  const project = await projectRepo.findOne({ where: { id: project_id } });
  const user = await userRepo.findOne({ where: { username: username } });

  if (!assigneeUser) {
    return res.status(404).json({
      error_msg: "Cannot find assignee",
    });
  }

  if (!project) {
    return res.status(400).json({
      error_msg: "Cannot find project",
    });
  }

  if (!status || !prior || !type) {
    return res.status(400).json({
      error_msg: "Cannot find status, priority or type",
    });
  }

  // Check if user is in the project
  if (!user?.allProjects.includes(project.projectName)) {
    return res.status(400).json({
      error_msg: "User is not in the project",
    });
  }

  if (assignee === undefined || assignee === "" || assignee === "Me") {
    assignee = username;
  }

  const tasks = {
    taskName: name,
    assignee: assignee,
    start_date: req_start_date,
    end_date: req_end_date,
    project: project,
    type: type,
    status: status,
    priority: prior,
    user: user,
  };
  //insert task
  const rs = await AppDataSource.createQueryBuilder()
    .insert()
    .into(Task)
    .values(tasks)
    .execute();
  if (rs) {
    return res.status(200).json({
      message: "Create task successfully",
      data: tasks,
    });
  } else {
    return res.status(400).json({
      error_msg: "Create task failed",
    });
  }
};

export const userEditPrivateTask = async (req: Request, res: Response) => {
  const username = req.params.username;
  const task_id = parseInt(req.params.id);

  let assignee = req.body.assignee;
  const {
    name,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_project_id,
    req_type_id,
  } = req.body;

  const status = await statusRepo.findOne({ where: { id: req_status_id } });
  const prior = await priorRepo.findOne({ where: { id: req_prior_id } });
  const type = await typeRepo.findOne({ where: { id: req_type_id } });
  const assigneeUser = await userRepo.findOne({
    where: { username: assignee },
  });

  const project = await projectRepo.findOne({ where: { id: req_project_id } });
  const user = await userRepo.findOne({ where: { username: username } });

  if (!assigneeUser) {
    return res.status(404).json({
      error_msg: "Cannot find assignee",
    });
  }

  if (!project) {
    return res.status(400).json({
      error_msg: "Cannot find project",
    });
  }

  if (!status || !prior || !type) {
    return res.status(400).json({
      error_msg: "Cannot find status, priority or type",
    });
  }

  // Check if user is in the project

  if (!project.users.includes(user!)) {
    return res.status(400).json({
      error_msg: "User is not in the project",
    });
  }

  const tasks = taskRepo.findOne({ where: { id: task_id } });

  if (!tasks) {
    return res.status(400).json({
      error_msg: "Cannot find task",
    });
  }

  if (assignee === "" || assignee === undefined || assignee === "Me") {
    assignee = username;
  }

  const taskEdit = {
    taskName: name,
    assignee: assignee,
    start_date: req_start_date,
    end_date: req_end_date,
    project: project,
    type: type,
    status: status,
    priority: prior,
  };
  //update task
  await AppDataSource.createQueryBuilder()
    .update(Task)
    .set(taskEdit)
    .where("id = :id", { id: task_id })
    .execute()
    .catch((err) => {
      return res.status(400).json({
        error_msg: "Update task failed",
      });
    });

  return res.status(200).json({
    message: "Edit task successfully",
    data: taskEdit,
  });
};

export const userDeletePrivateTask = async (req: Request, res: Response) => {
  const username = req.params.username;
  const task_id = req.params.id;

  const user = await userRepo.findOne({ where: { username: username } });
  const task = await taskRepo.findOne({ where: { id: parseInt(task_id) } });

  if (!task) {
    return res.status(400).json({
      error_msg: "Cannot find task",
    });
  }

  if (!user) {
    return res.status(400).json({
      error_msg: "Cannot find user",
    });
  }

  if (task.assignee !== user.username) {
    return res.status(400).json({
      error_msg: "User doesn't have permission to delete this task",
    });
  }
  //delete task
  const rs = await AppDataSource.createQueryBuilder()
    .delete()
    .from(Task)
    .where("id = :id", { id: task_id })
    .execute();
  if (rs) {
    return res.status(200).json({
      message: "Delete task successfully",
    });
  }

  return res.status(400).json({
    error_msg: "Delete task failed",
  });
};

export const allUserTask = async (req: Request, res: Response) => {
  const username = req.params.username;

  const user = await userRepo.findOne({ where: { username: username } });

  if (!user) {
    return res.status(400).json({
      error_msg: "Cannot find user",
    });
  }

  const users = await AppDataSource.createQueryBuilder()
    .select("task")
    .from(Task, "task")
    .where("task.assignee = :assignee", {
      assignee: user!.username,
    })
    .getMany();

  if (!users) {
    return res.status(400).json({
      error_msg: "Cannot find task",
    });
  }
  return res.status(200).json({
    message: "Get all tasks successfully",
    data: users,
  });
};
