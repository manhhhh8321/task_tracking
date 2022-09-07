import { Response, Request, NextFunction } from "express";
import { IProject } from "../interfaces/main";
import slug from "slug";
import { userArray } from "./users";
import { Project } from "../entity/main";
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
  const allProjects = await projectRepo.find();

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
  const rs = await AppDataSource.createQueryBuilder().update(Project)
  .set({ projectName: name, slug: slug(name), start_date: start_date, end_date: end_date }).where("slug = :slug", { slug: slugParams }).execute(); 
  if (!rs) {
    return res.status(500).json({
      error_msg: "Cannot update project",
    });
  }
  res.send(`Update project ${name} successfully`);
};

const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  const slugParams = req.params.slug;
  
  const projectRepo = AppDataSource.getRepository(Project);
  const allProjects = await projectRepo.find();

  let index = allProjects.findIndex((item) => item.slug === slugParams);

  if (index < 0) {
    return res.status(404).json({
      error_msg: "Cannot find project",
    });
  } 

  const rs = await AppDataSource.createQueryBuilder().delete().from(Project).where("slug = :slug", { slug: slugParams }).execute();
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
  const allProjects = await projectRepo.find();

  const userIndex = allProjects.findIndex(
    (item) => item.members === req_username
  );

  if (userIndex >= 0) {
    return res.status(409).json({
      error_msg: "Member already in project",
    });
  }

  const userExist = userArray.findIndex(
    (item) => item.username === req_username
  );
  if (userExist < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  const projectIndex = projectArray.findIndex((item) => item.slug === req_slug);
  const index = userArray.findIndex((item) => item.username === req_username);

  projectArray[projectIndex].members.push(req_username);
  userArray[index].allProjects.push(projectArray[projectIndex].projectName);
  res.send(`Added user ${req_username} to project ${req_slug}`);
};

export const removeMember = (req: Request, res: Response) => {
  const { req_username } = req.body;
  const req_slug = req.params.slug;

  const userIndex = projectArray.findIndex(
    (item) => item.members === req_username
  );

  if (userIndex < 0) {
    return res.status(400).json({
      error_msg: "Member not in project",
    });
  }

  const userExist = userArray.findIndex(
    (item) => item.username === req_username
  );
  if (userExist < 0) {
    return res.status(404).json({
      error_msg: "Cannot find user",
    });
  }

  const projectIndex = projectArray.findIndex((item) => item.slug === req_slug);

  projectArray[projectIndex].members.splice(userIndex, 1);
  res.send(`Remove user ${req_username} from project ${req_slug}`);
};

export { createProject, viewAllProject, editProject, deleteProject };
