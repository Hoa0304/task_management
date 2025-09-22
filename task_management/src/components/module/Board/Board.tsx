"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import BoardColumn from "./BoardColumn";
import { taskStatusOrder } from "@/lib/constants";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { addTaskToStatus } from "@/lib/api";

interface BoardProps {
  tasks: Task[];
}

export default function Board({ tasks: initialTasks }: BoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleTaskUpdate = (updated: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task))
    );
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setTasks((prev) => {
      const newTasks = [...prev];
      const taskIndex = newTasks.findIndex((t) => t.id.toString() === draggableId);
      if (taskIndex === -1) return prev;

      const [movedTask] = newTasks.splice(taskIndex, 1);

      // update local state
      movedTask.status = destination.droppableId as TaskStatus;

      const reordered: Task[] = [];
      taskStatusOrder.forEach((status) => {
        const tasksOfStatus = newTasks.filter((t) => t.status === status);
        if (status === movedTask.status) {
          tasksOfStatus.splice(destination.index, 0, movedTask);
        }
        reordered.push(...tasksOfStatus);
      });

      return reordered;
    });

    try {
      await addTaskToStatus(Number(draggableId), destination.droppableId);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {taskStatusOrder.map(status => (
          <BoardColumn
            key={status}
            title={status}
            tasks={tasks.filter(t => t.status === status)}
            allTasks={tasks}
            onStatusChange={handleStatusChange}
            onTaskUpdate={handleTaskUpdate}
            isDroppable
          />
        ))}
      </div>
    </DragDropContext>
  );
}
