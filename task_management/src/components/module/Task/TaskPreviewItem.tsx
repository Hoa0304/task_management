"use client";

import { Task } from "@/lib/types";
import { Pencil, Trash } from "lucide-react";
import { LABEL_COLOR_MAP, PRIORITY_COLOR_MAP } from "@/lib/constants";

export default function TaskPreviewItem({
    task,
    onEdit,
    onDelete,
}: {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
}) {
    const labelColor =
        task.category && LABEL_COLOR_MAP[task.category.toLowerCase()]
            ? LABEL_COLOR_MAP[task.category.toLowerCase()]
            : "#999";

    const priorityColor =
        task.priority && PRIORITY_COLOR_MAP[task.priority.toLowerCase()]
            ? PRIORITY_COLOR_MAP[task.priority.toLowerCase()]
            : "#999";

    return (
        <li className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div>
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
                    <p className="text-base font-medium text-indigo-700">{task.title}</p>
                </div>

                <div className="flex space-x-2">
                    <div className="bg-[#34D870] rounded-md p-1 shadow-sm hover:bg-[#28b75b] transition-colors">
                        <button
                            onClick={() => onEdit(task)}
                            className="text-white p-1 rounded-md transition"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                    </div>

                    <div className="bg-red-600 rounded-md p-1 shadow-sm hover:bg-red-700 transition-colors">
                        <button
                            onClick={() => onDelete(task.id)}
                            className="text-white p-1 rounded-md transition"
                            title="Delete"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
}
