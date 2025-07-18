import { Task, TaskStatus, User } from "@/lib/types";
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
  const initialValues: Partial<Omit<Task, "id">> = {
    title: "",
    description: "",
    status,
    dueDate: "",
    category: undefined,
    cover: "",
    members: [],
    completed: 0,
    total: 8,
    priority: undefined,
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
