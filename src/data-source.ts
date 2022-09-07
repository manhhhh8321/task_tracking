import "reflect-metadata";
import { DataSource } from "typeorm";
import { Admin,Priority,Project,Status,Task,Type,User } from "./entity/main";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "test",
  entities: [User, Admin,Priority,Project,Status,Task,Type, "./entity/main.ts"],
  synchronize: true,
});

//initialize the database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.log("Database connection failed");
    console.log(error);
  });
