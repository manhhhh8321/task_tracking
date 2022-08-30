import { createProject } from "../controllers/project";
import express from "express";
const projectRouter = express.Router();

projectRouter.post("/project", createProject);

export { projectRouter };
