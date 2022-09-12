import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import {
  IProject,
  Users,
  IPriority,
  IStatus,
  ITask,
  IType,
  Admins,
} from "../interfaces/main";

@Entity()
export class Admin {
  @PrimaryColumn()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}

//Create entity class for project that implements IProject interface
@Entity()
export class Project implements IProject {
  @PrimaryGeneratedColumn() id: number;
  @Column() projectName: string;
  @Column("simple-array") members: string[];
  @Column() start_date: string;
  @Column() end_date: string;
  @Column() slug: string;
  @Column("simple-array") task_closed: string[];
  @ManyToMany((type) => User, (user) => user.allProjects)
  @JoinTable()
  users: User[];
  // Create one to many relation with task entity
  @OneToMany((type) => Task, (task) => task.project, { onDelete: "CASCADE" })
  tasks: string[];
}

//Create entity class for user that implements Users interface
@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() username: string;
  @Column() password: string;
  @Column() name: string;
  @Column() birthday: string;
  @Column() inviteID: string;
  @Column() defaultProject: string;
  @Column("simple-array") allProjects: string[];
  @Column() active: boolean;
  @Column() email: string;
  //Create one to many relationship with task entity
  @OneToMany(() => Task, (task) => task.user, { onDelete: "CASCADE" })
  task: Task[];
  // Create many to many relationship with project entity
}

//Create entity class for status that implements IStatus interface
@Entity()
export class Status implements IStatus {
  @PrimaryGeneratedColumn() id: number;
  @Column() statusName: string;
  @Column() orderNumber: number;
  @Column() currentStatus: string;
  @Column() visible: boolean;
  // Create many to one relationship with task entity
  @OneToMany(() => Task, (task) => task.status, { onDelete: "CASCADE" })
  tasks: Task[];
}

//Create entity class for priority that implements IPriority interface
@Entity()
export class Priority implements IPriority {
  @PrimaryGeneratedColumn() id: number;
  @Column() priorName: string;
  @Column() orderNumber: number;
  @Column() visible: boolean;
  // Create many to one relationship with task entity
  @OneToMany(() => Task, (task) => task.priority, { onDelete: "CASCADE" })
  tasks: Task[];
}

//Create entity class for type that implements IType interface
@Entity()
export class Type implements IType {
  @PrimaryGeneratedColumn() id: number;
  @Column() defaultColor: string;
  @Column() color: string;
  @Column() typeName: string;
  @Column() visible: boolean;
  // Create many to one relationship with task entity
  @OneToMany(() => Task, (task) => task.type, { onDelete: "CASCADE" })
  tasks: Task[];
}

//Create entity class for task that implements ITask interface
@Entity()
export class Task implements ITask {
  @PrimaryGeneratedColumn() id: number;
  @Column() taskName: string;
  @Column() assignee: string;
  // Create many to one relationship with project entity
  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: Project;
  // Create many to one relationship with status entity
  @ManyToOne(() => Status, (status) => status.tasks, { onDelete: "CASCADE" })
  status: Status;
  // Create many to one relationship with type entity
  @ManyToOne(() => Type, (type) => type.tasks, { onDelete: "CASCADE" })
  type: Type;
  // Create many to one relationship with priority entity
  @ManyToOne(() => Priority, (priority) => priority.tasks, {
    onDelete: "CASCADE",
  })
  priority: Priority;
  @Column() start_date: string;
  @Column() end_date: string;
  // Create many to one relation with user entity
  @ManyToOne(() => User, (user) => user.task, { onDelete: "CASCADE" })
  user: User;
}

// Crete entity class for table that store invite id
@Entity()
export class Invite {
  @PrimaryColumn() id: string;
}
