export interface IProject {
  projectID: number;
  projectName: string;
  members: string[];
  start_date: string;
  end_date: string;
  slug: string;
  tasks: string[];
  task_closed: string[];
}

export interface IManageUser {
  userID: number;
  inviteID: number;
  defaultProject: string;
  allProjects: string[];
  active: boolean;
}

export interface IStatus {
  statusID: number;
  statusName: string;
  orderNumber: number;
  currentStatus: string;
  visible: boolean;
}

export interface IPriority {
  priorID: number;
  priorName: string;
  orderNumber: number;
  visible: boolean;
}

export interface IType {
  typeID: number;
  defaultColor: string;
  color: string;
  typeName: string;
  visible: boolean;
}

export interface ITask {
  taskID: number;
  taskName: string;
  assignee: string;
  project: IProject;
  status: IStatus;
  type: IType;
  priority: IPriority;
  start_date: string;
  end_date: string;
}

export interface Users {
  userID: number;
  username: string;
  password: string;
  name: string;
  birthday: string;
  email: string;
  inviteID: number;
  active: boolean;
  defaultProject: string;
  allProjects: string[];
  project: IProject;
  task: ITask;
}

export interface Admins {
  userID: number;
  username: string;
  password: string;
  role: string;
}

// export interface IUserProject {
//   tasks: string[];
// }

// export interface IUserTasks {
//   allTask: string[];
// }
