import { Response, Request, NextFunction } from "express";
import { IProject } from "../interfaces/main";
import slug from "slug";

const projectArray: IProject[] = [];

const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, start_date, end_date } = req.body;
  const prs: IProject = {
    projectID: projectArray.length + 1,
    projectName: name,
    slug: slug(name),
    members: [],
    tasks: ["A", "B"],
    task_closed: ["A"],
    start_date: start_date,
    end_date: end_date,
  };

  if (projectArray.length > 0) {
    for (let el of projectArray) {
      if (el.slug == slug(name))
        return res.status(403).json({
          status_code: 0,
          error_msg: "Project name existed",
        });
    }
  }
  if (req.body) {
    projectArray.push(prs);
  }
  res.send(projectArray);
};

const viewAllProject = (req: Request, res: Response) => {
  // let pushArray = [];
  // for (let el of projectArray) {
  //   const taskAmount = el.tasks.length;
  //   const closedTaskAmount = el.task_closed.length;

  //   const obj = {
  //     projectName: el.projectName,
  //     taskAmount: taskAmount,
  //     process: closedTaskAmount / taskAmount,
  //   };
  //   pushArray.push(obj);
  // }
  // if (projectArray.length > 0) {
  //   res.json(pushArray);
  // } else {
  //   return res.status(403).json({
  //     status_code: 0,
  //     error_msg: "No content found",
  //   });
  // }
  res.send(projectArray);
};

const editProject = (req: Request, res: Response, next: NextFunction) => {
  const { name, start_date, end_date } = req.body;
  const slugParams = req.params.slug;
  const index = projectArray.findIndex((item) => item.slug == slugParams);

  if (index >= 0) {
    projectArray[index].projectName = name;
    projectArray[index].start_date = start_date;
    projectArray[index].end_date = end_date;
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find project name",
    });
  }
  res.send(projectArray[index]);
};

const deleteProject = (req: Request, res: Response, next: NextFunction) => {
  const slugParams = req.params.slug;
  let index = projectArray.findIndex((item) => item.slug == slugParams);

  if (index >= 0) {
    projectArray.splice(index - 1, 1);
    res.send(projectArray);
  } else {
    return res.status(403).json({
      status_code: 0,
      error_msg: "Cannot find project",
    });
  }
};

const addMemberToProject = (req: Request, res: Response) => {
  const slugParams = req.params.slug;
  const member = req.body.memeberName;
  for (let el of projectArray) {
    if (el.slug == slugParams) {
      el.members.push();
    }
  }
};

export { createProject, viewAllProject, editProject, deleteProject };
