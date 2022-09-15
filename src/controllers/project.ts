import slug from "slug";
import { Response, Request, NextFunction } from "express";
import { AppDataSource } from "../data-source";

import { Project, User } from "../entity/main";

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, start_date, end_date } = req.body;

  const projectRepo = AppDataSource.getRepository(Project);
  const project = await projectRepo.findOne({ where: { projectName: name } });

  if (project) {
    return res.status(409).json({
      error_msg: "Project name existed",
    });
  }

  const createNewProject = () => {
    const newProject = new Project();
    newProject.projectName = name;
    newProject.slug = slug(name);
    newProject.start_date = start_date;
    newProject.end_date = end_date;
    newProject.members = [];
    newProject.task_closed = [];
    return newProject;
  };

  const rs = await projectRepo.save(createNewProject());

  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot create project",
    });
  }

  res.send(rs);
};

const viewAllProject = async (req: Request, res: Response) => {
  const projectRepo = AppDataSource.getRepository(Project);
  const allProjects = await projectRepo.find({ relations: ["tasks"] });

  if (!allProjects) {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }

  let pushArray = [];
  for (let el of allProjects) {
    const taskAmount = el.tasks.length;
    const closedTaskAmount = el.task_closed.length;

    const obj = {
      projectName: el.projectName,
      taskAmount: taskAmount,
      // check process if taskAmount = 0 => process = 0
      process: taskAmount === 0 ? 0 : (closedTaskAmount / taskAmount) * 100,
    };
    pushArray.push(obj);
  }

  res.json(pushArray);
};

const editProject = async (req: Request, res: Response, next: NextFunction) => {
  const { name, start_date, end_date } = req.body;
  const slugParams = req.params.slug;

  const projectRepo = AppDataSource.getRepository(Project);

  const project = await projectRepo.findOne({ where: { slug: slugParams } });

  if (!project) {
    return res.status(404).json({
      error_msg: "Cannot find project name",
    });
  }

  const rs = await AppDataSource.createQueryBuilder()
    .update(Project)
    .set({
      projectName: name,
      slug: slug(name),
      start_date: start_date,
      end_date: end_date,
    })
    .where("slug = :slug", { slug: slugParams })
    .execute();

  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot update project",
    });
  }
  res.send(`Update project ${name} successfully`);
};

const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const slugParams = req.params.slug;

  const projectRepo = AppDataSource.getRepository(Project);
  const project = await projectRepo.findOne({ where: { slug: slugParams } });

  if (!project) {
    return res.status(404).json({
      error_msg: "Cannot find project",
    });
  }

  const rs = await AppDataSource.createQueryBuilder()
    .delete()
    .from(Project)
    .where("slug = :slug", { slug: slugParams })
    .execute();

  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot delete project",
    });
  }
  res.send(`Delete project ${slugParams} successfully`);
};

export const addMemberToProject = async (req: Request, res: Response) => {
  const { req_username } = req.body;
  const req_slug = req.params.slug;

  const projectRepo = AppDataSource.getRepository(Project);
  const userRepo = AppDataSource.getRepository(User);

  const project = await projectRepo.findOne({
    where: { slug: req_slug },
    relations: ["users"],
  });
  const user = await userRepo.findOne({ where: { username: req_username } });

  const checkUser = await projectRepo.findOne({
    where: { members: req_username },
  });

  if (checkUser) {
    return res.status(409).json({
      error_msg: "User already in project",
    });
  }

  if (!user) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (!project) {
    return res.status(404).json({
      error_msg: "Cannot find project",
    });
  }

  // Create transaction to add member to project and add project to user project list
  await AppDataSource.transaction(async (transactionalEntityManager) => {
    project.members.push(user.username);
    user.allProjects.push(project.projectName);
    project.users.push(user);

    await transactionalEntityManager.save(project);
    await transactionalEntityManager.save(Project, project);
    await transactionalEntityManager.save(User, user);
  })
    .then(() => {
      return res.send(
        `Add member ${req_username} to project ${req_slug} successfully`
      );
    })
    .catch((err) => {
      console.log(err);

      return res.status(500).json({
        error_msg: "Cannot add member to project",
      });
    });
};

export const removeMember = async (req: Request, res: Response) => {
  const { req_username } = req.body;
  const req_slug = req.params.slug;

  const projectRepo = AppDataSource.getRepository(Project);
  const userRepo = AppDataSource.getRepository(User);

  const project = await projectRepo.findOne({
    where: { slug: req_slug },
    relations: ["users"],
  });
  const user = await userRepo.findOne({ where: { username: req_username } });
  const checkUser = await projectRepo.findOne({
    where: { members: req_username },
  });

  if (!user) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  if (!project) {
    return res.status(404).json({
      error_msg: "Cannot find project",
    });
  }

  if (!checkUser) {
    return res.status(400).json({
      error_msg: "Member not in project",
    });
  }

  await AppDataSource.transaction(async (transactionalEntityManager) => {
    const userIndex = project!.members.indexOf(req_username);

    project.members.splice(userIndex, 1);

    user.allProjects.splice(
      user.allProjects.indexOf(project?.projectName as string),
      1
    );
    await transactionalEntityManager.save(Project, project);
    await transactionalEntityManager.save(User, user);
    // Create query builder to delete user from project
    project.users = project.users.filter((el) => el.id !== user.id);

    await transactionalEntityManager.save(Project, project);
  })
    .then(() => {
      return res.send(
        `Remove member ${req_username} from project ${req_slug} successfully`
      );
    })
    .catch((err) => {
      return res.status(500).json({
        error_msg: "Cannot remove member from project",
      });
    });
};

export { createProject, viewAllProject, editProject, deleteProject };
