import { Task } from "@/lib/types";
import TaskFormBase from "../../common/Form";

export default function EditTaskForm({
  task,
  onUpdate,
  onCancel,
}: {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onCancel: () => void;
}) {
  return (
    <TaskFormBase
      initialData={task}
      onSubmit={onUpdate}
      onCancel={onCancel}
      submitLabel="Update"
    />
  );
}
