export type TaskStatus = "Backlog" | "To Do" | "In Progress" | "Review";

export interface Member {
  name: string;
  avatar: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  label?: string;
  cover?: string;
  members?: Member[]; 
  completed?: number;
  total?: number;
}
