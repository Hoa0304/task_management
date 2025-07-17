"use client";

import { Task, TaskStatus } from "@/lib/types";
import { useState } from "react";
import { X } from "lucide-react";
import TaskCard from "../Task/TaskCard";
import Status from "./Status";
import CreateTaskForm from "../Task/CreateTaskForm";

import EditTaskForm from "../Task/EditTaskForm";

export default function BoardColumn({ title, tasks }: { title: TaskStatus; tasks: Task[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // <--- thêm
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const handleCreate = (task: Task) => {
    const newTask = { ...task, id: Date.now() };
    setLocalTasks([newTask, ...localTasks]);
    setIsAdding(false);
  };

  const handleUpdate = (updatedTask: Task) => {
    setLocalTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setIsEditing(false);
  };

  return (
    <section className="min-w-[15rem] sm:w-65 flex-shrink-0">
      <Status
        title={title}
        onAdd={() => setIsAdding(true)}
        onEdit={() => setIsEditing(true)} // <-- thêm
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
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-hidden bg-white rounded-2xl p-6">
            <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
            <CreateTaskForm
              status={title}
              onCreate={handleCreate}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-hidden bg-white rounded-2xl p-6">
            <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
            <EditTaskForm
              task={localTasks[0]} // hoặc chọn task cụ thể
              onUpdate={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

