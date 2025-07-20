"use client";

import { Task, TaskStatus, User } from "@/lib/types";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import TaskCard from "../Task/TaskCard";
import Status from "./Status";
import CreateTaskForm from "../Task/CreateTaskForm";
import RemoveTaskModal from "./Modals/RemoveTaskModal";
import {
  createTask,
  deleteTask,
  fetchUsers,
  addTaskToStatus,
  moveTaskBack,
} from "@/lib/api";
import { LABEL_COLOR_MAP, PRIORITY_COLOR_MAP, taskStatusOrder } from "@/lib/constants";

export default function BoardColumn({
  title,
  tasks,
  allTasks,
  onStatusChange,
}: {
  title: TaskStatus;
  tasks: Task[];
  allTasks: Task[];
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isPickingTask, setIsPickingTask] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [users, setUsers] = useState<User[]>([]);
  const [isRemovingTask, setIsRemovingTask] = useState(false);
  const [isReturningTask, setIsReturningTask] = useState(false);


  const handleCreate = async (task: Omit<Task, "id">) => {
    try {
      const created = await createTask(task);
      setLocalTasks([created, ...localTasks]);
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleAddTask = async (taskId: number) => {
    try {
      const added = await addTaskToStatus(taskId, title);
      if (added) {
        setLocalTasks((prev) => [added, ...prev]);
        onStatusChange(taskId, title);
      }
    } catch (err) {
      console.error("Failed to move task:", err);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    loadUsers();
  }, []);

  const getPreviousColumnTasks = (): Task[] => {
    const currentIndex = taskStatusOrder.indexOf(title);
    if (currentIndex <= 0) return [];
    const previousStatus = taskStatusOrder[currentIndex - 1];
    return allTasks.filter((t) => t.status === previousStatus);
  };

  return (
    <section className="min-w-[15rem] sm:w-65 flex-shrink-0">
      <Status
        title={title}
        onAdd={() => {
          if (title === "Backlog") setIsAdding(true);
          else setIsPickingTask(true);
        }}
        onRemove={() => {
          if (title === "Backlog") setIsRemovingTask(true);
          else setIsReturningTask(true);
        }}

      />


      <div className="space-y-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1 scroll-hidden">
        {localTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Modal: Create Task (only Backlog) */}
      {isAdding && title === "Backlog" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-hidden bg-[#F8F8FF] rounded-2xl p-6 shadow-[0_10px_50px_rgba(82,80,249,0.4)] border-[2px] border-[#5250F9]">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <CreateTaskForm
              status={title}
              onCreate={handleCreate}
              onCancel={() => setIsAdding(false)}
              users={users}
            />
          </div>
        </div>
      )}

      {isPickingTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
            <button
              onClick={() => setIsPickingTask(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <ul className="space-y-2">
              {getPreviousColumnTasks().length > 0 ? (
                getPreviousColumnTasks().map((task) => {
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
                      onClick={async () => {
                        await handleAddTask(task.id);
                        setIsPickingTask(false);
                      }}
                    >
                      <div className="flex items-center mb-3">
                        {task.priority && (
                          <span
                            className="w-3 h-3 rounded-full inline-block mr-5"
                            style={{ backgroundColor: priorityColor }}
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
                <p className="text-sm text-gray-500">There are no tasks</p>
              )}
            </ul>
          </div>
        </div>
      )}

      {isRemovingTask && (
        <RemoveTaskModal
          title={title}
          tasks={localTasks}
          onClose={() => setIsRemovingTask(false)}
          onDelete={handleDelete}
        />
      )}

      {isReturningTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
            <button
              onClick={() => setIsReturningTask(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <ul className="space-y-2">
              {localTasks.length > 0 ? (
                localTasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-red-100 cursor-pointer"
                    onClick={async () => {
                      const moved = await moveTaskBack(task.id, title);
                      if (moved) {
                        setLocalTasks((prev) => prev.filter((t) => t.id !== task.id));
                        onStatusChange(task.id, moved.status);
                      }
                      setIsReturningTask(false);
                    }}
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {task.description}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">There are no tasks.</p>
              )}
            </ul>
          </div>
        </div>
      )}

    </section>
  );
}
