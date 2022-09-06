import { Response, Request, NextFunction } from "express";
import { IProject } from "../interfaces/main";
import slug from "slug";
import { userArray } from "./users";

export const projectArray: IProject[] = [];

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, start_date, end_date } = req.body;

  const index = projectArray.findIndex((item) => item.slug === slug(name));

  if (index >= 0) {
    return res.status(409).json({
      error_msg: "Project name existed",
    });
  }

  const prs: IProject = {
    projectID: projectArray.length + 1,
    projectName: name,
    slug: slug(name),
    members: [],
    tasks: [],
    task_closed: [],
    start_date: start_date,
    end_date: end_date,
  };

  projectArray.push(prs);
  res.send(projectArray);
};

const viewAllProject = (req: Request, res: Response) => {
  let pushArray = [];
  for (let el of projectArray) {
    const taskAmount = el.tasks.length;
    const closedTaskAmount = el.task_closed.length;

    const obj = {
      projectName: el.projectName,
      taskAmount: taskAmount,
      process: closedTaskAmount / taskAmount,
    };
    pushArray.push(obj);
  }
  if (projectArray.length > 0) {
    res.json(pushArray);
  } else {
    return res.status(204).json({
      error_msg: "No content found",
    });
  }
};

const editProject = (req: Request, res: Response, next: NextFunction) => {
  const { name, start_date, end_date } = req.body;
  const slugParams = req.params.slug;
  const index = projectArray.findIndex((item) => item.slug === slugParams);

  
    if (index >= 0) {
      projectArray[index].projectName = name;
      projectArray[index].start_date = start_date;
      projectArray[index].end_date = end_date;
    } else {
      return res.status(404).json({
        error_msg: "Cannot find project name",
      });
    }
  
  res.send(projectArray[index]);
};

const deleteProject = (req: Request, res: Response, next: NextFunction) => {
  const slugParams = req.params.slug;
  let index = projectArray.findIndex((item) => item.slug === slugParams);

  if (index >= 0) {
    projectArray.splice(index, 1);
    res.send(projectArray);
  } else {
    return res.status(404).json({
      error_msg: "Cannot find project",
    });
  }
};

export const addMemberToProject = (req: Request, res: Response) => {
  const { req_username } = req.body;
  const req_slug = req.params.slug;

  const userIndex = projectArray.findIndex(
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
