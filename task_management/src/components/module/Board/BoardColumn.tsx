"use client";

import { Task, TaskStatus, User } from "@/lib/types";
import { useState } from "react";
import { X } from "lucide-react";
import TaskCard from "../Task/TaskCard";
import Status from "./Status";
import CreateTaskForm from "../Task/CreateTaskForm";
import EditTaskForm from "../Task/EditTaskForm";
import TaskPreviewItem from "../Task/TaskPreviewItem";
import { createTask, deleteTask, fetchUsers, updateTask } from "@/lib/api";
import { useEffect } from "react";


export default function BoardColumn({ title, tasks }: { title: TaskStatus; tasks: Task[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [users, setUsers] = useState<User[]>([]);

const handleCreate = async (task: Omit<Task, "id">) => {

    try {
      const created = await createTask(task);
      setLocalTasks([created, ...localTasks]);
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };
  const handleUpdate = async (updatedTask: Task) => {
    const taskToUpdate = {
      ...updatedTask,
      due_date: updatedTask.dueDate
        ? new Date(updatedTask.dueDate).toISOString().split("T")[0]
        : undefined,
    };

    try {
      const result = await updateTask(updatedTask.id, taskToUpdate);

      setLocalTasks((prev) =>
        prev.map((t) => (t.id === result.id ? result : t))
      );

      setEditingTask(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  useEffect(() => {
  const loadUsers = async () => {
    try {
      const data = await fetchUsers(); // GỌI API MỚI
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  loadUsers();
}, []);
  return (
    <section className="min-w-[15rem] sm:w-65 flex-shrink-0">
      <Status
        title={title}
        onAdd={() => setIsAdding(true)}
        onEdit={() => setIsEditing(true)}
      />

      {/* Task list */}
      <div className="space-y-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1 scroll-hidden">
        {localTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-hidden bg-[#F8F8FF] rounded-2xl p-6 shadow-[0_10px_50px_rgba(82,80,249,0.4)] border-[2px] border-[#5250F9]">
            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
            <CreateTaskForm
              status={title}
              onCreate={handleCreate}
              onCancel={() => setIsAdding(false)}
              users={users}
            />
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-hidden bg-white rounded-2xl p-6">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingTask(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            {editingTask ? (
              <EditTaskForm
                task={editingTask}
                onUpdate={(updatedTask) => {
                  handleUpdate(updatedTask);
                  setEditingTask(null);
                  setIsEditing(false);
                }}
                onCancel={() => setEditingTask(null)}
              />
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Editor Tasks in {title}</h2>
                <ul className="space-y-4">
                  {localTasks.map((task) => (
                    <TaskPreviewItem
                      key={task.id}
                      task={task}
                      onEdit={(t) => setEditingTask(t)}
                      onDelete={handleDelete}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
