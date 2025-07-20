"use client";

import { TaskStatus } from "@/lib/types";
import { Minus, Plus } from "lucide-react";

export default function Status({
  title,
  onAdd,
  onRemove,
}: {
  title: TaskStatus;
  onAdd: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="relative flex items-center justify-between mb-4 p-3 bg-white shadow rounded-xl">
      <h2 className="text-sm sm:text-base font-semibold text-[#1D1E25]">{title}</h2>
      <div className="flex items-center gap-2">
        {onRemove && (
          <button
            onClick={onRemove}
            className="bg-red-100 p-1 rounded-md hover:bg-red-200 transition-colors"
          >
            <Minus className="w-4 h-4 text-red-600" />
          </button>
        )}
        <button
          onClick={onAdd}
          className="bg-indigo-100 p-1 rounded-md hover:bg-indigo-200 transition-colors"
          title="Add task"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
        </button>
      </div>
    </div>
  );
}
