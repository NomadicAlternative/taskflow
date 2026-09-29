export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name: string | null;
  hashedPassword: string | null;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  ownerId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: Date;
  projectId: string;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

export interface ProjectWithTaskCount extends Project {
  taskCount: number;
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  ownerId: string;
}
