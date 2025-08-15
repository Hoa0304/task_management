"use client";

import { useState } from "react";
import ReusableForm from "@/components/common/Form";
import { taskFields } from "@/lib/constants";
import { updateTask } from "@/lib/api";
import { Task, User } from "@/lib/types";

export default function EditTaskForm({
  task,
  onUpdate,
  onCancel,
  users = [],
}: {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onCancel: () => void;
  users?: User[];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (data: Record<string, any>) => {
  setLoading(true);
  setError(null);

  try {
    // Map từ ID sang object {id, name, avatar}
    const formattedData = {
      ...data,
      members: data.members?.map((id: string | number) => {
        const user = users.find((u) => u.id === Number(id));
        return user
          ? { id: user.id, name: user.name, avatar: user.avatar }
          : null;
      }).filter(Boolean) || [],
    };

    const updated = await updateTask(task.id, formattedData);
    onUpdate(updated);
  } catch (err: any) {
    setError(err.message || "Failed to update task");
  } finally {
    setLoading(false);
  }
};

const initialValues: Record<string, any> = {
  ...task,
  members: task.members?.map((m) => m.id.toString()) || [],
};

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <ReusableForm
        fields={taskFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        users={users}
        submitLabel={loading ? "Updating..." : "Update"}
      />
    </div>
  );
}
