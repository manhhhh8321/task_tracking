import { Request, Response } from "express";

import { AppDataSource } from "../data-source";
import { Status, Priority, Task, Type, User, Project } from "../entity/main";

const userRepo = AppDataSource.getRepository(User);
const projectRepo = AppDataSource.getRepository(Project);
const taskRepo = AppDataSource.getRepository(Task);
const statusRepo = AppDataSource.getRepository(Status);
const priorRepo = AppDataSource.getRepository(Priority);
const typeRepo = AppDataSource.getRepository(Type);

export const userJoinedProject = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  const user = await userRepo.findOne({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }
  res.send(`All projects of ${user.username}: ${user.allProjects}`);
};

export const userDetailProject = async (req: Request, res: Response) => {
  const username = req.params.username;
  const projectId = req.params.id;
  const pushArray = [];

  const user = await userRepo.findOne({ where: { username: username } });

  if (!user) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  const project = await projectRepo.findOne({
    where: { id: parseInt(projectId) },
  });

  if (!project) {
    return res.status(404).json({
      error_msg: "Cannot find project",
    });
  }

  if (!user?.allProjects.includes(project!?.projectName)) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  // Find task by username and project id
  const allTasks = await taskRepo.find({
    relations: ["project", "status", "priority", "type"],
  });

  // Count number of records in task where assignee = username and project id = projectId
  const countTask = allTasks.filter(
    (item) =>
      item.assignee === username && item.project.id === parseInt(projectId)
  ).length;

  const currentTask = countTask;
  const closedTask = project.task_closed.length;
  const obj = {
    projectName: project.projectName,
    allTasks: currentTask + closedTask,
    closedTasks: closedTask,
    // Check process if it is number or not, if not then return 0
    process: isNaN((closedTask / currentTask) * 100)
      ? 0
      : (closedTask / currentTask) * 100,
    start_date: project.start_date,
    end_date: project.end_date,
  };
  pushArray.push(obj);
  res.send(pushArray);
};

export const allTaskOfUserProject = async (req: Request, res: Response) => {
  const username = req.params.username;
  const projectId = req.params.id;

  const user = await userRepo.findOne({ where: { username: username } });
  const allStatus = await statusRepo.find();

  if (allStatus.length <= 0) {
    return res.status(404).json({
      error_msg: "Not any status",
    });
  }

  const project = await projectRepo.findOne({
    where: { id: parseInt(projectId) },
  });

  if (!user || !project) {
    return res.status(404).json({
      error_msg: "Cannot find user || project",
    });
  }

  if (!user?.allProjects.includes(project?.projectName)) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  const allTasks = await taskRepo.find({ relations: ["status"] });

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

  const {
    name,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;

  const user = await userRepo.findOne({ where: { username: username } });
  const project = await projectRepo.findOne({
    where: { id: parseInt(req_project_id) },
  });
  const status = await statusRepo.findOne({
    where: { id: parseInt(req_status_id) },
  });
  const prior = await priorRepo.findOne({
    where: { id: parseInt(req_prior_id) },
  });
  const type = await typeRepo.findOne({
    where: { id: parseInt(req_type_id) },
  });

  // Create transaction to create new tasks then update user id in task table
  await AppDataSource.createEntityManager().transaction(
    async (transactionalEntityManager) => {
      const newTask = new Task();
      newTask.taskName = name;
      newTask.assignee = username;
      newTask.start_date = req_start_date;
      newTask.end_date = req_end_date;
      newTask.project = project!;
      newTask.type = type!;
      newTask.status = status!;
      newTask.priority = prior!;
      newTask.user = user!;

      await transactionalEntityManager.save(newTask);

      const task = await transactionalEntityManager.findOne(Task, {
        where: { assignee: username },
        relations: ["project", "status", "priority", "type", "user"],
      });

      // Update user id in task table
      if (task) {
        task.user = user!;
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

  const {
    name,
    assignee,
    req_start_date,
    req_end_date,
    req_prior_id,
    req_status_id,
    req_type_id,
  } = req.body;

  const user = await userRepo.findOne({ where: { username: username } });
  const newAssignee = await userRepo.findOne({ where: { username: assignee } });

  if (!newAssignee) {
    return res.status(404).json({
      error_msg: "Cannot find new assignee",
    });
  }

  const project = await projectRepo.findOne({
    where: { id: parseInt(project_id) },
  });
  const status = await statusRepo.findOne({
    where: { id: parseInt(req_status_id) },
  });
  const prior = await priorRepo.findOne({
    where: { id: parseInt(req_prior_id) },
  });
  const type = await typeRepo.findOne({
    where: { id: parseInt(req_type_id) },
  });

  const task = await taskRepo.findOne({
    where: { id: task_id },
    relations: ["project", "status", "priority", "type", "user"],
  });

  if (!user || !project) {
    return res.status(404).json({
      error_msg: "Cannot find user || project",
    });
  }

  if (!user?.allProjects.includes(project?.projectName)) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  if (!task) {
    return res.status(404).json({
      error_msg: "Cannot find task",
    });
  }

  if (!task.assignee.includes(username)) {
    return res.status(409).json({
      error_msg: "User don't have this task",
    });
  }

  if (!status || !prior || !type) {
    return res.status(404).json({
      error_msg: "Cannot find status || prior || type",
    });
  }

  // Create new  query builder ti update task for user, project, user
  await AppDataSource.createQueryBuilder()
    .update(Task)
    .set({
      taskName: name,
      assignee: assignee,
      start_date: req_start_date,
      end_date: req_end_date,
      type: type,
      status: status,
      priority: prior,
      user: newAssignee,
    })
    .where("id = :id", { id: task_id })
    .execute()
    .then(() => {
      return res.status(200).json({
        success_msg: "Update task successfully",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error_msg: "Update task failed",
      });
    });
};

export const userDeleteTask = async (req: Request, res: Response) => {
  const username = req.params.username;
  const task_id = req.params.task_id;
  const project_id = req.body.project_id;

  const user = await userRepo.findOne({ where: { username: username } });
  const project = await projectRepo.findOne({
    where: { id: parseInt(project_id) },
  });

  if (!user || !project) {
    return res.status(404).json({
      error_msg: "Cannot find user || project",
    });
  }

  if (!user?.allProjects.includes(project?.projectName)) {
    return res.status(404).json({
      error_msg: "User not in project",
    });
  }

  const task = await taskRepo.findOne({
    where: { id: parseInt(task_id) },
    relations: ["project", "status", "priority", "type", "user"],
  });

  if (!task) {
    return res.status(404).json({
      error_msg: "Cannot find task",
    });
  }

  if (!task.assignee.includes(username)) {
    return res.status(409).json({
      error_msg: "User don't have this task",
    });
  }

  // Delete task of user then update project, task
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Task)
    .where("id = :id", { id: task_id })
    .execute()
    .catch((err) => {
      return res.status(500).json({
        error_msg: "Delete task failed",
      });
    });

  res.send(`Delete task successfully`);
};
