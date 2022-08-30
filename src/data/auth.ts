import { Admins, Users } from "../interfaces/main";

export const userData: Users = {
  userID: 1,
  username: "abc",
  password: "123",
  name: "Nam",
  birthday: "01/01/01",
  email: "123@email",
  inviteID: 1,
  active: true,
  defaultProject: "Pr1",
  allProjects: ["Pr1"],
  project: {
    projectID: 1,
    projectName: "Pr1",
    members: ["A", "B"],
    start_date: "01/01/2001",
    end_date: "10/10/2001",
    tasks: ["A", "B"],
    task_closed: ["A"],
    slug: "No",
  },
  task: {
    taskID: 1,
    assignee: "Me",
    taskName: "Doing a",
    type: {
      typeID: 1,
      color: "red",
      defaultColor: "white",
      typeName: "Development",
      visible: true,
    },
    priority: {
      priorID: 1,
      priorName: "Need tobe done",
      orderNumber: 1,
      visible: true,
    },
    status: {
      statusID: 1,
      statusName: "In progress",
      orderNumber: 1,
      currentStatus: "New",
      visible: true,
    },
  },
};

export const adminData: Admins = {
  userID: 1,
  username: "admin",
  password: "123",
};
