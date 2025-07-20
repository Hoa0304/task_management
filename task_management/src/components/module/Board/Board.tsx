"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import BoardColumn from "./BoardColumn";
import { taskStatusOrder } from "@/lib/constants";

export default function Board({ tasks }: { tasks: Task[] }) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {taskStatusOrder.map((col) => (
        <BoardColumn
          key={col}
          title={col}
          tasks={localTasks.filter((t) => t.status === col)}
          allTasks={localTasks}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}
