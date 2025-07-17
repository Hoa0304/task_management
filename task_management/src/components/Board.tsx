import { Task } from "@/lib/types";
import BoardColumn from "./BoardColumn";

export default function Board({ tasks }: { tasks: Task[] }) {
  const columns = ["Backlog", "To Do", "In Progress", "Review", "Done"] as const;
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => (
        <BoardColumn key={col} title={col} tasks={tasks.filter((t) => t.status === col)} />
      ))}
    </div>
  );
}
