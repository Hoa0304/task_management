export type TaskStatus = "Backlog" | "To Do" | "In Progress" | "Review" | "Done";

export interface Member {
  name: string;
  avatar: string;
}

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskCategory = "Design" | "Content" | "Research" | "Planning";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  category?: TaskCategory;
  cover?: string;
  members?: Member[];
  completed?: number;
  total?: number;
  priority?: TaskPriority;
}

