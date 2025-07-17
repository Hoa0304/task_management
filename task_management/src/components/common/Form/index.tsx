"use client";
import { useState} from "react";
import { Task, TaskStatus, TaskPriority, TaskCategory } from "@/lib/types";
import ImageUploader from "../Image";

type Props = {
  initialData?: Partial<Task>;
  status?: TaskStatus;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  submitLabel?: string;
};

export default function TaskFormBase({
  initialData = {},
  status = "To Do",
  onSubmit,
  onCancel,
  submitLabel = "Create",
}: Props) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [dueDate, setDueDate] = useState(initialData.dueDate || "");
  const [category, setCategory] = useState<TaskCategory>(
    initialData.category || "Planning"
  );
  const [cover, setCover] = useState(initialData.cover || "");
  const [completed, setCompleted] = useState(initialData.completed || 0);
  const [total, setTotal] = useState(initialData.total || 8);
  const [priority, setPriority] = useState<TaskPriority>(
    initialData.priority || "Low"
  );

  const handleSubmit = () => {
    if (!title.trim()) return;

    const task: Task = {
      id: initialData.id || Date.now(),
      title,
      description,
      dueDate,
      status: initialData.status || status,
      category,
      cover,
      completed,
      total,
      priority,
    };

    onSubmit(task);
  };

  return (
    <section className="bg-white p-4 w-full font-sans space-y-2 scroll-hidden max-h-[80vh] overflow-y-auto">
      <div>
        <label className="text-sm font-medium text-[#232360] block mb-1">
          Title
        </label>
        <input
          className="w-full border text-sm rounded-md p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          maxLength={100}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-[#232360] block mb-1">
          Description
        </label>
        <textarea
          className="w-full border text-sm rounded-md p-2 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short description"
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-[#232360] block mb-1">
            Due Date
          </label>
          <input
            type="date"
            className="w-full border text-sm rounded-md p-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#232360] block mb-1">
            Category
          </label>
          <select
            className="w-full border text-sm rounded-md p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
          >
            <option value="Design">Design</option>
            <option value="Research">Research</option>
            <option value="Planning">Planning</option>
            <option value="Content">Content</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-[#232360] block mb-1">
          Priority
        </label>
        <select
          className="w-full border text-sm rounded-md p-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <ImageUploader onImageUpload={setCover} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-[#232360] block mb-1">
            Completed
          </label>
          <input
            type="number"
            className="w-full border text-sm rounded-md p-2"
            min={0}
            value={completed}
            onChange={(e) => setCompleted(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#232360] block mb-1">
            Total
          </label>
          <input
            type="number"
            className="w-full border text-sm rounded-md p-2"
            min={1}
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onCancel}
          className="text-gray-600 px-4 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#5051F9] text-white px-5 py-1.5 rounded-md hover:bg-indigo-700 text-sm"
        >
          {submitLabel}
        </button>
      </div>
    </section>
  );
}
