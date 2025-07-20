"use client";
import { Task, TaskStatus } from "@/lib/types";
import { X } from "lucide-react";

export default function RemoveTaskModal({
  tasks,
  onDelete,
  onClose,
}: {
  title: TaskStatus;
  tasks: Task[];
  onDelete: (taskId: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <ul className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                key={task.id}
                className="p-3 bg-gray-100 rounded-lg hover:bg-red-100 cursor-pointer"
                onClick={() => onDelete(task.id)}
              >
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-500">{task.description}</div>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">There are no tasks.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
