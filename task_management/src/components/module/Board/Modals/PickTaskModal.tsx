"use client";
import { Task, TaskStatus } from "@/lib/types";
import { X } from "lucide-react";
import { LABEL_COLOR_MAP, PRIORITY_COLOR_MAP } from "@/lib/constants";

export default function PickTaskModal({
  tasks,
  onSelect,
  onClose,
}: {
  title: TaskStatus;
  tasks: Task[];
  onSelect: (taskId: number) => void;
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
            tasks.map((task) => {
              const labelColor =
                task.category && LABEL_COLOR_MAP[task.category.toLowerCase()]
                  ? LABEL_COLOR_MAP[task.category.toLowerCase()]
                  : "#999";

              const priorityColor =
                task.priority && PRIORITY_COLOR_MAP[task.priority.toLowerCase()]
                  ? PRIORITY_COLOR_MAP[task.priority.toLowerCase()]
                  : "#999";

              return (
                <li
                  key={task.id}
                  className="p-3 bg-gray-100 rounded-lg hover:bg-indigo-100 cursor-pointer"
                  onClick={() => onSelect(task.id)}
                >
                  <div className="flex items-center mb-3">
                    {task.priority && (
                      <span
                        className="w-3 h-3 rounded-full inline-block mr-5"
                        style={{ backgroundColor: priorityColor }}
                        title={task.priority}
                      />
                    )}
                    {task.category && (
                      <span
                        className="text-xs text-white h-[22px] px-3 rounded-lg font-medium inline-flex items-center justify-center leading-[20px]"
                        style={{ backgroundColor: labelColor }}
                      >
                        {task.category}
                      </span>
                    )}
                  </div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap">
                    {task.description}
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">Không có task nào để chuyển.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
