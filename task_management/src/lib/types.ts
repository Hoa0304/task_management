export type TaskStatus = "Backlog" | "To Do" | "In Progress" | "Review" | "Done";

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskCategory = "Design" | "Content" | "Research" | "Planning";

export type TaskRole =
  | "Product Design"
  | "UI/UX Design"
  | "Content Writing"
  | "Copywriting"
  | "UX Research"
  | "Market Research"
  | "Product Management"
  | "Project Planning"
  | "Development"
  | "QA Testing"
  | "Marketing"
  | "Branding"
  | "Engineering"
  | "Analytics";

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
  category?: TaskCategory;
  cover?: string;
  members?: Member[];
  completed?: number;
  total?: number;
  priority?: TaskPriority;
}

export interface User {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  role?: TaskRole;
  avatar?: string;
}

export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "number"
  | "select"
  | "date"
  | "avatar"
  | "members";

export interface FieldConfig<T = Record<string, unknown>> {
  name: keyof T;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  icon?: React.ReactNode;
}

export interface FormProps<T = Record<string, unknown>> {
  fields: FieldConfig<T>[];
  initialValues: T;
  onSubmit: (data: T) => void;
  onCancel?: () => void;
  submitLabel?: string;
  showButtons?: boolean;
}

export interface BoardColumnProps {
  title: TaskStatus;
  tasks: Task[];
  allTasks: Task[];
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}
