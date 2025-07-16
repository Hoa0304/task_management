import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";
import { Plus, MoreHorizontal } from "lucide-react";

export default function BoardColumn({ title, tasks }: { title: TaskStatus; tasks: Task[] }) {
  return (
    <section className="w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4 p-3 bg-[#FFFF] shadow rounded-xl">
        <h2 className="text-base font-semibold text-[#1D1E25]">{title}</h2>
        <div className="flex items-center gap-2">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
          <button className="bg-indigo-100 p-1 rounded-md hover:bg-indigo-200 transition-colors">
            <Plus className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
