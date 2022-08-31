import express = require("express");
import { Application, NextFunction, Request, Response } from "express";
import { router } from "./routes/admin_login";
import { projectRouter } from "./routes/project";
import bodyParser from "body-parser";
import {
  createProject,
  editProject,
  viewAllProject,
  deleteProject,
  addMemberToProject,
  removeMember,
} from "./controllers/project";
import {
  createType,
  editType,
  viewAllType,
  setVisibleType,
} from "./controllers/type";
import {
  createStatus,
  editStatus,
  setVisibleStatus,
  viewAllStatus,
} from "./controllers/status";
import {
  createPrior,
  editPrior,
  setVisiblePrior,
  viewAllPrior,
} from "./controllers/priority";
import { adminLogin, testToken } from "./controllers/admin_login";
import {
  createTask,
  deleteTask,
  editTask,
  viewAllTasks,
} from "./controllers/task";
import { adminAuth } from "./middlewares/auth";
import { createInviteID, createUser, deleteUser, editUser, userLogin, viewAllUser, viewUserDetail } from "./controllers/users";

const app: Application = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Manage project
app.post("/project", createProject);
app.get("/project", viewAllProject);
app.put("/project/:slug", editProject);
app.delete("/project/:slug", deleteProject);
app.patch("/project/:slug", addMemberToProject);  
app.patch("/project/:slug/remove", removeMember);

//Manage type

app.post("/type", createType);
app.put("/type/:id", editType);
app.get("/type", viewAllType);
app.patch("/type/:id", setVisibleType);

//Manage status
app.post("/status", createStatus);
app.get("/status", viewAllStatus);
app.put("/status/:id", editStatus);
app.patch("/status/:id", setVisibleStatus);

//Manage prior
app.post("/priority", createPrior);
app.get("/priority", viewAllPrior);
app.put("/priority/:id", editPrior);
app.patch("/priority/:id", setVisiblePrior);

//Admin route
app.post("/admin_login", adminLogin);

//Manage tasks
app.post("/task", createTask);
app.put("/task/:id", editTask);
app.delete("/task/:id", deleteTask);
app.get("/task", viewAllTasks);

//Manage users
app.post("/register", createUser);
app.get("/create-inviteid", createInviteID);

app.get("/user", viewAllUser);
app.get("/user/:userid", viewUserDetail);
app.put("/user/:userid", editUser);
app.delete("/user/:userid", deleteUser);

//User login
app.post("/login", userLogin);

//Token test
app.get("/books", adminAuth, testToken);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("OK");
});
