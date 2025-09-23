import { FieldConfig, TaskStatus } from "./types";

export const LABEL_COLOR_MAP: Record<string, string> = {
  design: "#5051F9",
  research: "#1EA7FF",
  planning: "#E97342",
  content: "#F59E0B",
};

export const PRIORITY_COLOR_MAP: Record<string, string> = {
  high: "red",
  medium: "#FFD700",
  low: "#34D870",
};

export const taskFields: FieldConfig[] = [
  { 
    name: "title", 
    label: "Title", 
    type: "text", 
    placeholder: "Enter task title" 
  },
  { 
    name: "description", 
    label: "Description", 
    type: "textarea", 
    placeholder: "Enter task description" 
  },
  // {
  //   name: "status",
  //   label: "Status",
  //   type: "select",
  //   options: ["Backlog", "To Do", "In Progress", "Review", "Done"],
  // },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    options: ["Low", "Medium", "High"],
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["Design", "Content", "Research", "Planning"],
  },
  {
    name: "due_date",
    label: "Due Date",
    type: "date",
  },
  {
    name: "completed",
    label: "Number Tasks Done",
    type: "number",
    placeholder: "Enter number tasks done"
  },
  {
    name: "total",
    label: "Total Tasks Done",
    type: "number",
    placeholder: "Enter total task done"
  },
  {
    name: "cover",
    label: "Cover Image",
    type: "avatar",
  },
   {
    name: "members",
    label: "Assignees",
    type: "members",
  },
];

export const taskStatusOrder: TaskStatus[] = [
  "Backlog",
  "To Do",
  "In Progress",
  "Review",
  "Done",
];

export const defaultAvatar = "https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png";
