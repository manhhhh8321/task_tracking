import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Project } from "../entity/main";
import { User } from "../entity/main";
import { Status } from "../entity/main";
import { Task } from "../entity/main";
import { Type } from "../entity/main";
import { Priority } from "../entity/main";

const projectRepo = AppDataSource.getRepository(Project);
const userRepo = AppDataSource.getRepository(User);
const statusRepo = AppDataSource.getRepository(Status);
const taskRepo = AppDataSource.getRepository(Task);
const typeRepo = AppDataSource.getRepository(Type);
const priorRepo = AppDataSource.getRepository(Priority);

export const userCreatePrivateTask = async (req: Request, res: Response) => {
  const project_id = req.body.req_project_id;
  const username = req.params.username;

  const allProjects = await projectRepo.find();
  const allUsers = await userRepo.find();
  const allStatus = await statusRepo.find();
  const allType = await typeRepo.find();
  const allPriors = await priorRepo.find();

  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(project_id)
  );

  const isUserInProject = allProjects[projectIndex].members.findIndex((item) =>
    item.includes(username)
  );

  if (isUserInProject < 0) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  let assignee = req.body.assignee;

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
  const priorityIndex = allPriors.findIndex(
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

  if (assignee === undefined || assignee === "" || assignee === "Me") {
    assignee = username;
  }

  if (projectIndex >= 0) {
    const tasks = {
      taskName: name,
      assignee: assignee,
      start_date: req_start_date,
      end_date: req_end_date,
      project: allProjects[projectIndex],
      type: allType[typeIndex],
      status: allStatus[statusIndex],
      priority: allPriors[priorityIndex],
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
  } else {
    return res.status(404).json({
      error_msg: "Cannot find project",
    });
  }
};

export const userEditPrivateTask = async (req: Request, res: Response) => {
  const username = req.params.username;
  const task_id = parseInt(req.params.id);

  const allProjects = await projectRepo.find();
  const allStatus = await statusRepo.find();
  const allType = await typeRepo.find();
  const allPriors = await priorRepo.find();
  const allTasks = await taskRepo.find();

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

  const statusIndex = allStatus.findIndex(
    (item) => item.id === parseInt(req_status_id)
  );
  const priorityIndex = allPriors.findIndex(
    (item) => item.id === parseInt(req_prior_id)
  );
  const typeIndex = allType.findIndex(
    (item) => item.id === parseInt(req_type_id)
  );
  const projectIndex = allProjects.findIndex(
    (item) => item.id === parseInt(req_project_id)
  );

  if (assignee === "" || assignee === undefined) {
    assignee = "Me";
  }

  const index = allTasks.findIndex((item) => item.id === task_id);

  if (index >= 0) {
    if (assignee === "Me") {
      assignee = username;
    }
    const tasks = {
      taskName: name,
      assignee: assignee,
      start_date: req_start_date,
      end_date: req_end_date,
      project: allProjects[projectIndex],
      type: allType[typeIndex],
      status: allStatus[statusIndex],
      priority: allPriors[priorityIndex],
    };
    //update task
    const rs = await AppDataSource.createQueryBuilder()
      .update(Task)
      .set(tasks)
      .where("id = :id", { id: task_id })
      .execute();
    if (rs) {
      return res.status(200).json({
        message: "Update task successfully",
        data: tasks,
      });
    } else {
      return res.status(400).json({
        error_msg: "Update task failed",
      });
    }
  } else {
    return res.status(404).json({
      error_msg: "Cannot find task",
    });
  }
};

export const userDeletePrivateTask = async (req: Request, res: Response) => {
  const username = req.params.username;
  const task_id = req.params.id;

  const allTasks = await taskRepo.find();

  const taskIndex = allTasks.findIndex((item) => item.assignee === username);

  console.log(taskIndex);

  if (taskIndex >= 0) {
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
  } else {
    return res.status(400).json({
      error_msg: "Cannot delete task",
    });
  }
};

export const allUserTask = async (req: Request, res: Response) => {
  const user_id = req.params.id;

  const allUsers = await userRepo.find();
  const userIndex = allUsers.findIndex((item) => item.id === parseInt(user_id));

  if (userIndex >= 0) {
    const users = await AppDataSource.createQueryBuilder()
      .select("task")
      .from(Task, "task")
      .where("task.assignee = :assignee", {
        assignee: allUsers[userIndex].username,
      })
      .getMany();
    if (users) {
      return res.status(200).json({
        message: "Get all tasks successfully",
        data: users,
      });
    } else {
      return res.status(400).json({
        error_msg: "Get all tasks failed",
      });
    }
  } else {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }
};
