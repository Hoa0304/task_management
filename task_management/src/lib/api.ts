import axios from "axios";
import { Task, TaskStatus, User } from "@/lib/types";

const BASE_URL = "http://localhost:5000/api";

export async function fetchTasks(): Promise<Task[]> {
  const res = await axios.get(`${BASE_URL}/tasks/all`);
  return res.data;
}

export async function fetchTaskById(taskId: number): Promise<Task> {
  const res = await axios.get(`${BASE_URL}/tasks/${taskId}`);
  return res.data;
}

export async function createTask(task: Partial<Task>): Promise<Task> {
    const res = await axios.post(`${BASE_URL}/tasks/add`, task);
    return res.data;
}

export async function updateTask(taskId: number, task: Partial<Task>): Promise<Task> {
  const res = await axios.put(`${BASE_URL}/tasks/${taskId}`, task);
  return res.data;
}

export async function deleteTask(taskId: number): Promise<void> {
  await axios.delete(`${BASE_URL}/tasks/${taskId}`);
}

export async function login(email: string, password: string): Promise<void> {
  await axios.post(`${BASE_URL}/login`, { email, password }, {withCredentials: true,});
}

export async function register(email: string, password: string, name?: string): Promise<void> {
  await axios.post(`${BASE_URL}/register`, { email, password, name });
}

export async function fetchUser(): Promise<User> {
  const res = await axios.get(`${BASE_URL}/users/me`, { withCredentials: true, });
  return res.data;
}

export async function fetchUsers(): Promise<User[]> {
  const res = await axios.get(`${BASE_URL}/users/`);
  return res.data;
}

export async function updateUser(userId: number, data: Partial<User>): Promise<User> {
  const res = await axios.put(`${BASE_URL}/users/${userId}`, data, { withCredentials: true,});
  return res.data;
}

export async function addTaskToStatus(taskId: number, status: string): Promise<Task | null> {
  const res = await axios.put(`${BASE_URL}/tasks/status/add`, { task_id: taskId, status });
  return res.data;
}

export async function moveTaskBack(taskId: number, status: TaskStatus): Promise<Task | null> {
  const res = await axios.put(`${BASE_URL}/tasks/status/rollback`, { task_id: taskId, status });
  return res.data;
}

export async function generateTask(prompt: string) {
  const res = await axios.post(
    `${BASE_URL}/gemini/generate-gemini`,
    { prompt },
    { withCredentials: true }
  );
  return res.data;
}
