import { addMemberToProject, createProject, deleteProject, editProject, removeMember, viewAllProject } from "../controllers/project";
import express from "express";
const projectRouter = express.Router();

projectRouter.post("/project", createProject);
projectRouter.get("/project", viewAllProject);
projectRouter.put("/project/:slug", editProject);
projectRouter.delete("/project/:slug", deleteProject);
projectRouter.patch("/project/:slug", addMemberToProject);
projectRouter.patch("/project/:slug/remove", removeMember);

export { projectRouter };
