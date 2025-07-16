"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import ImageUploader from "../Image";

export default function TaskForm({
  status,
  onCreate,
  onCancel,
}: {
  status: TaskStatus;
  onCreate: (newTask: Task) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [label, setLabel] = useState("Planning");
  const [cover, setCover] = useState("");
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(8);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      dueDate,
      status,
      label,
      cover,
      completed,
      total,
    };

    onCreate(newTask);
  };

  return (
    <section className="bg-white p-5 w-full font-sans space-y-4">
      <div>
        <label className="text-sm font-medium text-[#232360] block mb-1">
          Title
        </label>
        <input
          className="w-full border border-[#C4C4C4] text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5051F9]"
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
          className="w-full border border-[#C4C4C4] text-sm rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#5051F9]"
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
            className="w-full border border-[#C4C4C4] text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5051F9]"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#232360] block mb-1">
            Label
          </label>
          <select
            className="w-full border border-[#C4C4C4] text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5051F9]"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          >
            <option value="Design">Design</option>
            <option value="Research">Research</option>
            <option value="Planning">Planning</option>
            <option value="Content">Content</option>
          </select>
        </div>
      </div>


<ImageUploader onImageUpload={(base64) => setCover(base64)} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-[#232360] block mb-1">
            Completed
          </label>
          <input
            type="number"
            className="w-full border border-[#C4C4C4] text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5051F9]"
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
            className="w-full border border-[#C4C4C4] text-sm rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#5051F9]"
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
          Create
        </button>
      </div>
    </section>
  );
}
