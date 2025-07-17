import { Task } from "@/lib/types";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("http://localhost:5000/api/tasks");

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const json: Task[] = await res.json();

  return json;
}
