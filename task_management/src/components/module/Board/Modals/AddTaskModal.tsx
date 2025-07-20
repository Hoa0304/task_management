"use client";

import { X } from "lucide-react";
import { TaskStatus, User, Task } from "@/lib/types";
import CreateTaskForm from "../../Task/CreateTaskForm";

export default function AddTaskModal({
  visible,
  onClose,
  onCreate,
  users,
  status,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (task: Omit<Task, "id">) => void;
  users: User[];
  status: TaskStatus;
}) {
  if (!visible || status !== "Backlog") return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-hidden bg-[#F8F8FF] rounded-2xl p-6 shadow-[0_10px_50px_rgba(82,80,249,0.4)] border-[2px] border-[#5250F9]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <CreateTaskForm
          status={status}
          onCreate={onCreate}
          onCancel={onClose}
          users={users}
        />
      </div>
    </div>
  );
}
