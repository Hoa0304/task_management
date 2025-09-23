"use client";

import { Task, TaskStatus, User } from "@/lib/types";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import TaskCard from "../Task/TaskCard";
import Status from "./Status";
import CreateTaskForm from "../Task/CreateTaskForm";
import RemoveTaskModal from "./Modals/RemoveTaskModal";
import EditTaskForm from "../Task/EditTaskForm";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { createTask, deleteTask, fetchUsers, addTaskToStatus, moveTaskBack } from "@/lib/api";
import { LABEL_COLOR_MAP, PRIORITY_COLOR_MAP, taskStatusOrder } from "@/lib/constants";

interface BoardColumnProps {
  title: TaskStatus;
  tasks: Task[];
  allTasks: Task[];
  onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
  onTaskUpdate: (updatedTask: Task) => void;
  isDroppable?: boolean;
}

export default function BoardColumn({
  title,
  tasks,
  allTasks,
  onStatusChange,
  onTaskUpdate,
  isDroppable = true,
}: BoardColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isPickingTask, setIsPickingTask] = useState(false);
  const [isRemovingTask, setIsRemovingTask] = useState(false);
  const [isReturningTask, setIsReturningTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    setLocalTasks(tasks);
    loadUsers();
  }, [tasks]);

  const handleCreate = async (task: Omit<Task, "id">) => {
    try {
      const created = await createTask(task);
      setLocalTasks([created, ...localTasks]);
      onTaskUpdate(created);
      onStatusChange(created.id, created.status);
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setLocalTasks((prev) => prev.filter((t) => t.id !== taskId));
      onStatusChange(taskId, "Deleted" as TaskStatus);
      setIsRemovingTask(false);
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
      setIsPickingTask(false);
    } catch (err) {
      console.error("Failed to move task:", err);
    }
  };

  const handleUpdate = (updated: Task) => {
    setLocalTasks((prev) =>
      prev.map((task) => (task.id === updated.id ? updated : task))
    );
    onTaskUpdate(updated);
    onStatusChange(updated.id, updated.status);
    setEditingTask(null);
  };

  const getPreviousColumnTasks = (): Task[] => {
    const currentIndex = taskStatusOrder.indexOf(title);
    if (currentIndex <= 0) return [];
    const previousStatus = taskStatusOrder[currentIndex - 1];
    return allTasks.filter(t => t.status === previousStatus);
  };

  return (
    <section className="min-w-[15rem] sm:w-65 flex-shrink-0">
      <Status
        title={title}
        onAdd={() => (title === "Backlog" ? setIsAdding(true) : setIsPickingTask(true))}
        onRemove={() => (title === "Backlog" ? setIsRemovingTask(true) : setIsReturningTask(true))}
      />

      {isDroppable && (
        <Droppable droppableId={title as string}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1 scroll-hidden"
            >
              {tasks.map((task, index) => (
                <Draggable
                  key={task.id.toString()}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} onClick={() => setEditingTask(task)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

      )}

      {/* Non-droppable fallback */}
      {!isDroppable && (
        <div className="space-y-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Modals */}
      {isAdding && title === "Backlog" && (
        <Modal onClose={() => setIsAdding(false)}>
          <CreateTaskForm status={title} onCreate={handleCreate} onCancel={() => setIsAdding(false)} users={users} />
        </Modal>
      )}

      {isPickingTask && (
        <Modal onClose={() => setIsPickingTask(false)}>
          <ul className="space-y-2">
            {getPreviousColumnTasks().length > 0 ? (
              getPreviousColumnTasks().map(task => (
                <li key={task.id} className="p-3 bg-gray-100 rounded-lg hover:bg-indigo-100 cursor-pointer mt-5" onClick={() => handleAddTask(task.id)}>
                  <div className="flex items-center mb-3">
                    {task.priority && <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PRIORITY_COLOR_MAP[task.priority.toLowerCase()] }} />}
                    {task.category && <span className="text-xs text-white px-2 rounded" style={{ backgroundColor: LABEL_COLOR_MAP[task.category.toLowerCase()] }}>{task.category}</span>}
                  </div>
                  <div>{task.title}</div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No tasks to pick</p>
            )}
          </ul>
        </Modal>
      )}

      {isRemovingTask && (
        <RemoveTaskModal title={title} tasks={tasks} onClose={() => setIsRemovingTask(false)} onDelete={handleDelete} />
      )}

      {isReturningTask && (
        <Modal onClose={() => setIsReturningTask(false)}>
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="p-3 bg-gray-100 rounded-lg hover:bg-red-100 cursor-pointer mt-5" onClick={async () => {
                const moved = await moveTaskBack(task.id, title);
                if (moved) onStatusChange(task.id, moved.status);
                setIsReturningTask(false);
              }}>
                <div className="flex items-center mb-3">
                  {task.priority && <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PRIORITY_COLOR_MAP[task.priority.toLowerCase()] }} />}
                  {task.category && <span className="text-xs text-white px-2 rounded" style={{ backgroundColor: LABEL_COLOR_MAP[task.category.toLowerCase()] }}>{task.category}</span>}
                </div>
                <div>{task.title}</div>
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {editingTask && (
        <Modal onClose={() => setEditingTask(null)}>
          <EditTaskForm task={editingTask} onUpdate={handleUpdate} onCancel={() => setEditingTask(null)} users={users} />
        </Modal>
      )}
    </section>
  );
}

// Generic modal wrapper
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto scroll-hidden bg-white rounded-2xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
