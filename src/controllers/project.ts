import { Response, Request, NextFunction } from "express";
import { IProject } from "../interfaces/main";
import slug from "slug";
import { userArray } from "./users";
import { Project, Task, User } from "../entity/main";
import { AppDataSource } from "../data-source";

export const projectArray: IProject[] = [];

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, start_date, end_date } = req.body;

  const projectRepo = AppDataSource.getRepository(Project);
  const allProjects = await projectRepo.find();
  const allUsers = await AppDataSource.getRepository(User).find();

  const index = allProjects.findIndex((item) => item.slug === slug(name));

  if (index >= 0) {
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

  let pushArray = [];
  for (let el of allProjects) {
    const taskAmount = el.tasks.length;
    const closedTaskAmount = el.task_closed.length;

    const obj = {
      projectName: el.projectName,
      taskAmount: taskAmount,
      process: closedTaskAmount / taskAmount,
    };
    pushArray.push(obj);
  }
  if (allProjects.length > 0) {
    res.json(pushArray);
  } else {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
};

const editProject = async (req: Request, res: Response, next: NextFunction) => {
  const { name, start_date, end_date } = req.body;
  const slugParams = req.params.slug;

  const projectRepo = AppDataSource.getRepository(Project);
  const allProjects = await projectRepo.find();

  const index = allProjects.findIndex((item) => item.slug === slugParams);

  if (index < 0) {
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
  const allProjects = await projectRepo.find();

  let index = allProjects.findIndex((item) => item.slug === slugParams);

  if (index < 0) {
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
  const allProject = await projectRepo.find();
  const userRepo = AppDataSource.getRepository(User);
  const allUsers = await userRepo.find();

  const projectIndex = allProject.findIndex((item) => item.slug === req_slug);

  // Check if user is already in project
  const checkExistedUser = allProject[projectIndex].members.findIndex(
    (item) => item === req_username
  );

  if (checkExistedUser >= 0) {
    return res.status(409).json({
      error_msg: "User already in project",
    });
  }

  const userIndex = allUsers.findIndex(
    (item) => item.username === req_username
  );
  if (userIndex < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  // Create transaction to add member to project and add project to user project list
  await AppDataSource.transaction(async (transactionalEntityManager) => {
    const project = await transactionalEntityManager.findOne(Project, {
      where: { slug: req_slug },
    });
    const user = await transactionalEntityManager.findOne(User, {
      where: { username: req_username },
    });

    allProject[projectIndex].members.push(user?.username as string);
    allUsers[userIndex].allProjects.push(project?.projectName as string);

    await transactionalEntityManager.save(Project, allProject[projectIndex]);
    await transactionalEntityManager.save(User, allUsers[userIndex]);
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

  const allUsers = await AppDataSource.getRepository(User).find();
  const allProject = await AppDataSource.getRepository(Project).find();

  const projectIndex = allProject.findIndex((item) => item.slug === req_slug);

  const userIndex = allProject[projectIndex].members.findIndex(
    (item) => item === req_username
  );

  if (userIndex < 0) {
    return res.status(400).json({
      error_msg: "Member not in project",
    });
  }

  const userExist = allUsers.findIndex(
    (item) => item.username === req_username
  );

  if (userExist < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  await AppDataSource.transaction(async (transactionalEntityManager) => {
    const project = await transactionalEntityManager.findOne(Project, {
      where: { slug: req_slug },
    });

    const user = await transactionalEntityManager.findOne(User, {
      where: { username: req_username },
    });

    if (!user) {
      return res.status(404).json({
        error_msg: "Cannot find user",
      });
    }

    allProject[projectIndex].members.splice(userIndex, 1);

    allUsers[userExist].allProjects.splice(
      allUsers[userExist].allProjects.indexOf(project?.projectName as string),
      1
    );

    await transactionalEntityManager.save(Project, allProject[projectIndex]);
    await transactionalEntityManager.save(User, allUsers[userExist]);
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
