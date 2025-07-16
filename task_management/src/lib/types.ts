export type TaskStatus = "Backlog" | "To Do" | "In Progress" | "Review";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  label?: string;
  cover?: string;
}
