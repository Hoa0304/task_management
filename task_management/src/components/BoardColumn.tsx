"use client";

import { Task, TaskStatus } from "@/lib/types";
import TaskForm from "./Task/TaskForm";
import { useState } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";
import TaskCard from "./Task/TaskCard";

export default function BoardColumn({ title, tasks }: { title: TaskStatus; tasks: Task[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const handleCreate = (task: Task) => {
    const newTask = {
      ...task,
      id: Date.now(),
    };
    setLocalTasks([newTask, ...localTasks]);
    setIsAdding(false);
  };

  return (
    <section className="min-w-[15rem] sm:w-65 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white shadow rounded-xl">
        <h2 className="text-sm sm:text-base font-semibold text-[#1D1E25]">{title}</h2>
        <div className="flex items-center gap-2">
          <MoreHorizontal className="w-5 h-5 text-[#768396]" />
          <button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-100 p-1 rounded-md hover:bg-indigo-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1 scroll-hidden">
        {localTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
            {/* Close button */}
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>

            <TaskForm
              status={title}
              onCreate={handleCreate}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
