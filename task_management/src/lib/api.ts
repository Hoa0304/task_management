import { Task } from "@/lib/types";

const BASE_URL = "http://localhost:5000/api/tasks";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export async function fetchTaskById(taskId: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${taskId}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch task with ID ${taskId}`);
  }

  return res.json();
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to create task");
  }

  return res.json();
}

export async function updateTask(taskId: number, task: Partial<Task>): Promise<Task> {
  const res = await fetch(`${BASE_URL}/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    throw new Error(`Failed to update task with ID ${taskId}`);
  }

  return res.json();
}

export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${taskId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete task with ID ${taskId}`);
  }
}
