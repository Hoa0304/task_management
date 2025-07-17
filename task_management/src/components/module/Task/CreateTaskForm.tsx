import { Task, TaskStatus } from "@/lib/types";
import TaskFormBase from "../../common/Form";

export default function CreateTaskForm({
  status,
  onCreate,
  onCancel,
}: {
  status: TaskStatus;
  onCreate: (task: Task) => void;
  onCancel: () => void;
}) {
  return (
    <TaskFormBase
      status={status}
      onSubmit={onCreate}
      onCancel={onCancel}
      submitLabel="Create"
    />
  );
}
