import { addMemberToProject, createProject, deleteProject, editProject, removeMember, viewAllProject } from "../controllers/project";
import express from "express";
import { validateCreateProject } from "../middlewares/validations";
const projectRouter = express.Router();

projectRouter.post("/", validateCreateProject, createProject);
projectRouter.get("/", viewAllProject);
projectRouter.put("/:slug", validateCreateProject, editProject);
projectRouter.delete("/:slug", deleteProject);
projectRouter.patch("/:slug", addMemberToProject);
projectRouter.patch("/:slug/remove", removeMember);

export { projectRouter };
