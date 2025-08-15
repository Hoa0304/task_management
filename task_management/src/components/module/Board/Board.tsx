"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import BoardColumn from "./BoardColumn";
import { taskStatusOrder } from "@/lib/constants";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    setTasks(prev => {
      const newTasks = Array.from(prev);
      const taskIndex = newTasks.findIndex(t => t.id.toString() === draggableId);
      const [movedTask] = newTasks.splice(taskIndex, 1);
      movedTask.status = destination.droppableId as TaskStatus;

      // Insert moved task at destination index among tasks of the same status
      const beforeTasks = newTasks.filter(t => t.status !== movedTask.status);
      const destTasks = newTasks.filter(t => t.status === movedTask.status);
      destTasks.splice(destination.index, 0, movedTask);

      return [...beforeTasks, ...destTasks];
    });
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
            isDroppable
          />
        ))}
      </div>
    </DragDropContext>
  );
}
