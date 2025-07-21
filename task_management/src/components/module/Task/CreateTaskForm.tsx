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
    dueDate: "",
    category: categoryDefault,
    cover: "",
    members: [],
    completed: 0,
    total: 8,
    priority: priorityDefault,
  };

  return (
    <ReusableForm
      fields={taskFields}
      initialValues={initialValues}
      onSubmit={(data) => {
        onCreate(data as Omit<Task, "id">);
      }}
      onCancel={onCancel}
      users={users}
      submitLabel="Create"
    />
  );
}
