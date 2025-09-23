"use client";

import { Task, TaskCategory, TaskPriority, TaskStatus, User } from "@/lib/types";
import ReusableForm from "@/components/common/Form";
import { taskFields } from "@/lib/constants";

export default function CreateTaskForm({
  status,
  onCreate,
  onCancel,
  users = [],
}: {
  status: TaskStatus;
  onCreate: (task: Omit<Task, "id">) => void;
  onCancel: () => void;
  users?: User[];
}) {
  const categoryDefault = (taskFields.find(f => f.name === "category")?.options?.[0] ?? "Design") as TaskCategory;
  const priorityDefault = (taskFields.find(f => f.name === "priority")?.options?.[0] ?? "Low") as TaskPriority;

  const initialValues: Partial<Omit<Task, "id">> = {
    title: "",
    description: "",
    status,
    due_date: "",
    category: categoryDefault,
    cover: "",
    members: [],
    completed: 0,
    total: 8,
    priority: priorityDefault,
  };

  const handleSubmit = (data: any) => {
    const memberObjects = users
      .filter((u) => data.members.includes(u.id.toString()))
      .map((u) => ({ id: u.id, name: u.name, avatar: u.avatar }));

    onCreate({ ...data, members: memberObjects });
  };

  return (
    <ReusableForm
      fields={taskFields}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      users={users}
      submitLabel="Create"
    />
  );
}
