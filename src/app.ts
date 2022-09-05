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

const app: Application = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Manage project
app.use("/", projectRouter);
//Manage type
app.use("/", typeRouter);
//Manage status
app.use("/", statusRouter);
//Manage prior
app.use("/", priorityRouter);
//Manage tasks
app.use("/", taskRouter);
//Manage users
app.use("/", userRouter);
//User login
app.use("/", loginRouter);
//Users_project
app.use("/", userProjectRouter);
//User_task_actions
app.use("/", userPrivateTaskRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("OK");
});
