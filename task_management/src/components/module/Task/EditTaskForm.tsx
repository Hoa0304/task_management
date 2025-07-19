import ReusableForm from "@/components/common/Form";
import { taskFields } from "@/lib/constants";
import { Task } from "@/lib/types";

export default function EditTaskForm({
  task,
  onUpdate,
  onCancel,
}: {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onCancel: () => void;
}) {
  const handleSubmit = (data: Record<string, any>) => {
    const updatedTask: Task = {
      ...task,
      ...data,
    };
    onUpdate(updatedTask);
  };

  return (
    <ReusableForm
      fields={taskFields}
      initialValues={task}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Update"
    />
  );
}
