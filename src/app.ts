import express = require("express");
import { Application } from "express";
import { projectRouter } from "./routes/project";
import bodyParser from "body-parser";

import { priorityRouter } from "./routes/priority";
import { typeRouter } from "./routes/type";
import { taskRouter } from "./routes/task";
import { userRouter } from "./routes/user";
import { statusRouter } from "./routes/status";
import { userPrivateTaskRouter } from "./routes/user_task_action";
import { loginRouter } from "./routes/login";
import { userProjectRouter } from "./routes/user_project";
import { adminAuth, userAuth } from "./middlewares/auth";

const app: Application = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//User login
app.use("/", loginRouter);
// Manage project
app.use("/project", adminAuth, projectRouter);
//Manage type
app.use("/type", adminAuth, typeRouter);
//Manage status
app.use("/status", adminAuth, statusRouter);
//Manage prior
app.use("/priority", adminAuth, priorityRouter);
//Manage tasks
app.use("/task", adminAuth, taskRouter);
//Manage users
app.use("/user", adminAuth, userRouter);

//Users_project
app.use("/projects", userAuth, userProjectRouter);
//User_task_actions
app.use("/", adminAuth, userPrivateTaskRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("OK");
});
