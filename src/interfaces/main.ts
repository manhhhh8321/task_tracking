export interface IProject {
  id: number;
  projectName: string;
  members: string[];
  start_date: string;
  end_date: string;
  slug: string;
  tasks: string[];
  task_closed: string[];
}

export interface IManageUser {
  id: number;
  inviteID: number;
  defaultProject: string;
  allProjects: string[];
  active: boolean;
}

export interface IStatus {
  id: number;
  statusName: string;
  orderNumber: number;
  currentStatus: string;
  visible: boolean;
}

export interface IPriority {
  id: number;
  priorName: string;
  orderNumber: number;
  visible: boolean;
}

export interface IType {
  id: number;
  defaultColor: string;
  color: string;
  typeName: string;
  visible: boolean;
}

export interface ITask {
  id: number;
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
  id: number;
  username: string;
  password: string;
  name: string;
  birthday: string;
  email: string;
  inviteID: string;
  active: boolean;
  defaultProject: IProject;
  allProjects: string[];
  project: IProject;
  task: string[];
}

export interface Admins {
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
