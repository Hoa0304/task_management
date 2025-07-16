'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TaskStatus } from '@/lib/types';

export default function NewTaskPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending' as TaskStatus,
    dueDate: '',
  });

  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating task:', form);
    router.push('/');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        <select
          className="w-full border p-2 rounded"
          value={form.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {['Pending', 'In Progress', 'Completed'].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={form.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Create Task
        </button>
      </form>
    </div>
  );
}
